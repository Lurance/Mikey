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
const typedi_1 = require("typedi");
const Todo_1 = require("../model/Todo");
const ms = require("ms");
let TodoService = class TodoService {
    constructor() {
        this.todoModel = Todo_1.Todo;
    }
    async createDefaultTodo(userId) {
        await this.todoModel.create({
            user: userId,
            content: '欢迎使用Peggy',
            rank: 0,
            type: 1
        });
        await this.todoModel.create({
            user: userId,
            content: '在我上面向左滑动删除',
            rank: 0,
            type: 1
        });
        await this.todoModel.create({
            user: userId,
            content: '向右滑动修改完成状态',
            rank: 0,
            type: 1
        });
        await this.todoModel.create({
            user: userId,
            content: '点击上方左侧的按钮可以进入日程评估分析视图',
            rank: 0,
            type: 1
        });
        await this.todoModel.create({
            user: userId,
            content: '点击上方右侧的按钮可以进入日程总结日历视图并添加新的日程',
            rank: 0,
            type: 1
        });
    }
    async generateLongTimeTodo(todo, longtimekey) {
        for (let startTime = todo.createdAt.getTime() + ms('1d'); startTime < todo.endAt.getTime(); startTime += ms('1d')) {
            this.todoModel.create({
                user: todo.user,
                content: todo.content,
                type: todo.type,
                rank: todo.rank,
                longtimekey: longtimekey,
                is_done: todo.is_done,
                endAt: todo.endAt,
                createdAt: startTime
            });
        }
    }
};
TodoService = __decorate([
    typedi_1.Service(),
    __metadata("design:paramtypes", [])
], TodoService);
exports.TodoService = TodoService;
//# sourceMappingURL=todo.service.js.map