import {Get, JsonController, State} from "routing-controllers"
import {TodoService} from "../service/todo.service"
import {Payload} from "../model/User"
import ms = require("ms")
import {Types} from "mongoose"


@JsonController()
export class EvaluateController {
    constructor(private todoService: TodoService) {
    }

    @Get('/evaluate')
    async getEvaluateInfo(@State('user') user: Payload): Promise<any> {
        const now = new Date(),
            lastMonth = new Date(`${now.getFullYear()}-${now.getMonth()}`)

        let lastMonthRateInfo = null,
            lastWeekRateInfo = null

        const rate = await this.todoService.todoModel.aggregate([
            {$match: {user: Types.ObjectId(user.id), createdAt: {$lte: now, $gte: lastMonth}}},
            {
                $group:
                    {
                        _id: {month: {$month: "$createdAt"}, week: {$week: "$createdAt"}, is_done: "$is_done"},
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
        //     [ { _id: { month: 5, week: 20, is_done: true }, count: 1 },
        //     { _id: { month: 5, week: 21, is_done: true }, count: 1 },
        //     { _id: { month: 5, week: 20, is_done: false }, count: 2 },
        //     { _id: { month: 5, week: 21, is_done: false }, count: 3 },
        //     { _id: { month: 4, week: 14, is_done: true }, count: 1 },
        //     { _id: { month: 4, week: 15, is_done: false }, count: 1 },
        //     { _id: { month: 4, week: 14, is_done: false }, count: 2 } ]




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
                lastMonthRateInfo: {
                    tSum: tSum,
                    fSum: fSum,
                }
            }
        }

        lastWeekRateInfo = async () => {
            let tSum = 0, fSum = 0;
            const tmp = new Date()
            tmp.setDate(1)
            tmp.setMonth(0)

            const lastWeek = Math.floor((now.getTime() - tmp.getTime()) / 1000 / 60 / 60 /24 / 7) - 1

            rate
                .filter(v => v._id.week === lastWeek)
                .forEach((v, index, ary) => {
                    if (v._id.is_done) {
                        tSum = tSum + v.count
                    } else {
                        fSum = fSum + v.count
                    }
                })
            return {
                lastWeekRateInfo: {
                    tSum: tSum,
                    fSum: fSum,
                }
            }
        }

        return Promise.all([lastMonthRateInfo(), lastWeekRateInfo()])
    }
}