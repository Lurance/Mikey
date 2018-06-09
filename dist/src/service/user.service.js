"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
const User_1 = require("../model/User");
const jsonwebtoken_1 = require("jsonwebtoken");
const environments_1 = require("../config/environments");
const ms = require("ms");
const typedi_1 = require("typedi");
const mongoose_1 = require("mongoose");
const todo_service_1 = require("./todo.service");
const Share_1 = require("../model/Share");
let UserService = class UserService {
    constructor(todoService) {
        this.todoService = todoService;
        this.userModel = User_1.User;
        this.shareModel = Share_1.Share;
    }
    signUser(user) {
        const payload = {
            id: user.id,
            openid: user.openid,
            usertype: user.usertype,
            friendkey: user.friendkey,
            expiresOn: Date.now() + ms(environments_1.Environment.jwtExpires)
        };
        let t = !!user.avatarUrl;
        return {
            usertype: user.usertype,
            userinfo: t,
            jwt: {
                token: jsonwebtoken_1.sign(payload, environments_1.Environment.jwtSecret, {
                    expiresIn: environments_1.Environment.jwtExpires
                }),
                expiresOn: Date.now() + ms(environments_1.Environment.jwtExpires)
            }
        };
    }
    async createNewCustomer(openid) {
        const newUser = await this.userModel.create({
            openid: openid
        });
        await this.todoService.createDefaultTodo(newUser._id);
        return newUser;
    }
    async getEvaluateDataFromUser(userid) {
        const now = new Date(), lastMonth = new Date(`${now.getFullYear()}-${now.getMonth()}`);
        let lastMonthRateInfo = null, monthRateInfo = null, yearInfo = null;
        const rate = await this.todoService.todoModel.aggregate([
            {
                $match: {
                    user: mongoose_1.Types.ObjectId(userid),
                    createdAt: {
                        $gte: new Date(now.getFullYear().toString()),
                        $lt: new Date((now.getFullYear() + 1).toString())
                    }
                }
            },
            {
                $project: {
                    created: { $add: ['$createdAt', 28800000] },
                    is_done: 1
                }
            },
            {
                $group: {
                    _id: { month: { $month: "$created" }, week: { $week: "$created" }, is_done: "$is_done" },
                    count: { $sum: 1 },
                }
            },
            {
                $sort: {
                    "_id.month": -1,
                    "_id.is_done": -1
                }
            }
        ]);
        lastMonthRateInfo = async () => {
            let tSum = 0, fSum = 0;
            rate
                .filter(v => v._id.month === lastMonth.getMonth() + 1)
                .forEach((v, index, ary) => {
                if (v._id.is_done) {
                    tSum = tSum + v.count;
                }
                else {
                    fSum = fSum + v.count;
                }
            });
            return {
                tSum: tSum,
                fSum: fSum,
            };
        };
        monthRateInfo = async () => {
            let tSum = 0, fSum = 0;
            rate
                .filter(v => v._id.month === now.getMonth() + 1)
                .forEach((v, index, ary) => {
                if (v._id.is_done) {
                    tSum = tSum + v.count;
                }
                else {
                    fSum = fSum + v.count;
                }
            });
            return {
                tSum: tSum,
                fSum: fSum,
            };
        };
        yearInfo = async () => {
            const doneRes = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
            const totalRes = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
            rate
                .forEach(v => {
                totalRes[v._id.month - 1] = totalRes[v._id.month - 1] + v.count;
                if (v._id.is_done) {
                    doneRes[v._id.month - 1] = doneRes[v._id.month - 1] + v.count;
                }
            });
            return [doneRes, totalRes];
        };
        return Promise.all([lastMonthRateInfo(), monthRateInfo(), yearInfo()]);
    }
};
UserService = __decorate([
    typedi_1.Service(),
    __metadata("design:paramtypes", [todo_service_1.TodoService])
], UserService);
exports.UserService = UserService;
//# sourceMappingURL=user.service.js.map