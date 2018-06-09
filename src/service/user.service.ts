import {IUser, User, UserType} from "../model/User"
import {sign} from "jsonwebtoken"
import {Environment} from "../config/environments"
import ms = require("ms")
import {Service} from "typedi"
import {Model, Types} from "mongoose"
import {TodoService} from "./todo.service"
import {IShare, Share} from "../model/Share"

@Service()
export class UserService {
    public userModel: Model<IUser>
    public shareModel: Model<IShare>

    constructor(private todoService: TodoService) {
        this.userModel = User
        this.shareModel = Share
    }

    public signUser(user: IUser): {usertype: UserType, userinfo: boolean, jwt: {token: string, expiresOn: number}} {
        const payload = {
            id: user.id,
            openid: user.openid,
            usertype: user.usertype,
            friendkey: user.friendkey,
            expiresOn: Date.now() + ms(Environment.jwtExpires)
        }

        let t = !!user.avatarUrl

        return {
            usertype: user.usertype,
            userinfo: t,
            jwt: {
                token: sign(payload, Environment.jwtSecret, {
                    expiresIn: Environment.jwtExpires
                }),
                expiresOn: Date.now() + ms(Environment.jwtExpires)
            }
        }
    }

    public async createNewCustomer(openid: string): Promise<IUser> {
        const newUser = await this.userModel.create({
            openid: openid
        })
        await this.todoService.createDefaultTodo(newUser._id)
        return newUser
    }


    public async getEvaluateDataFromUser(userid: string): Promise<any> {
        const now = new Date(),
            lastMonth = new Date(`${now.getFullYear()}-${now.getMonth()}`)

        let lastMonthRateInfo = null,
            monthRateInfo = null,
            yearInfo = null

        const rate = await this.todoService.todoModel.aggregate([
            {
                $match: {
                    user: Types.ObjectId(userid),
                    createdAt: {
                        $gte: new Date(now.getFullYear().toString()),
                        $lt: new Date((now.getFullYear() + 1).toString())
                    }
                }
            },
            {
                $project: {
                    created: {$add: ['$createdAt', 28800000]},
                    is_done: 1
                }
            },
            {
                $group:
                    {
                        _id: {month: {$month: "$created"}, week: {$week: "$created"}, is_done: "$is_done"},
                        count: {$sum: 1},
                    }
            },
            {
                $sort: {
                    "_id.month": -1,
                    "_id.is_done": -1
                }
            }
        ])


        //     Example Rate:
        //     [ { _id: { month: 6, week: 25, is_done: false }, count: 4 },
        //     { _id: { month: 6, week: 24, is_done: false }, count: 7 },
        //     { _id: { month: 6, week: 21, is_done: false }, count: 2 },
        //     { _id: { month: 6, week: 22, is_done: false }, count: 7 },
        //     { _id: { month: 6, week: 23, is_done: false }, count: 7 },
        //     { _id: { month: 5, week: 21, is_done: true }, count: 1 },
        //     { _id: { month: 5, week: 20, is_done: true }, count: 1 },
        //     { _id: { month: 5, week: 20, is_done: false }, count: 2 },
        //     { _id: { month: 5, week: 21, is_done: false }, count: 8 },
        //     { _id: { month: 4, week: 14, is_done: true }, count: 1 },
        //     { _id: { month: 4, week: 15, is_done: false }, count: 1 },
        //     { _id: { month: 4, week: 14, is_done: false }, count: 2 },
        //     { _id: { month: 3, week: 11, is_done: true }, count: 1 },
        //     { _id: { month: 3, week: 10, is_done: false }, count: 3 },
        //     { _id: { month: 2, week: 5, is_done: false }, count: 1 } ]


        lastMonthRateInfo = async () => {
            let tSum = 0, fSum = 0;
            rate
                .filter(v => v._id.month === lastMonth.getMonth() + 1)
                .forEach((v, index, ary) => {
                    if (v._id.is_done) {
                        tSum = tSum + v.count
                    } else {
                        fSum = fSum + v.count
                    }
                })
            return {
                tSum: tSum,
                fSum: fSum,
            }
        }

        monthRateInfo = async () => {
            let tSum = 0, fSum = 0;
            rate
                .filter(v => v._id.month === now.getMonth() + 1)
                .forEach((v, index, ary) => {
                    if (v._id.is_done) {
                        tSum = tSum + v.count
                    } else {
                        fSum = fSum + v.count
                    }
                })
            return {
                tSum: tSum,
                fSum: fSum,
            }
        }

        yearInfo = async () => {
            const doneRes = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
            const totalRes = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
            rate
                .forEach(v => {
                    totalRes[v._id.month - 1] = totalRes[v._id.month - 1] + v.count
                    if (v._id.is_done) {
                        doneRes[v._id.month - 1] = doneRes[v._id.month - 1] + v.count
                    }
                })

            return [doneRes, totalRes]
        }


        return Promise.all([lastMonthRateInfo(), monthRateInfo(), yearInfo()])
    }
}


