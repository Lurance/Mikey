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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
const routing_controllers_1 = require("routing-controllers");
const todo_service_1 = require("../service/todo.service");
const Todo_1 = require("../model/Todo");
const ms = require("ms");
const genNonDuplicateID_1 = require("../helpers/genNonDuplicateID");
let TodoController = class TodoController {
    constructor(todoService) {
        this.todoService = todoService;
    }
    async createTodo(type, content, rank, createdAt, endAt, user) {
        const newTodo = await this.todoService.todoModel.create({
            user: user.id,
            type: type,
            createdAt: createdAt,
            content: content.trim(),
            rank: rank,
            endAt: endAt,
        });
        if (newTodo.type === 2) {
            const longtimekey = genNonDuplicateID_1.genNonDuplicateID(5);
            await newTodo.update({ longtimekey: longtimekey });
            this.todoService.generateLongTimeTodo(newTodo, longtimekey);
        }
        return newTodo;
    }
    async getTodos(date, user) {
        return await this.todoService.todoModel.find({
            createdAt: {
                $gte: new Date(date).getTime(),
                $lt: new Date(date).getTime() + ms('1d')
            },
            user: user.id
        });
    }
    async getTodosDateSet(year_month, user) {
        let res = [];
        await this.todoService.todoModel.find({ user: user.id, createdAt: { $gte: new Date(year_month).getTime(), $lte: new Date(year_month).getTime() + ms('31d') } })
            .then(data => {
            data.forEach(t => {
                res.push(`${t.createdAt.getFullYear()}/${t.createdAt.getMonth() + 1}/${t.createdAt.getDate()}`);
            });
        });
        return Array.from(new Set(res));
    }
    async UpdateTodo(id, todo, user) {
        const rt = await this.todoService.todoModel.findOneAndUpdate({
            _id: id,
            user: user.id
        }, todo, { new: true });
        if (rt.type === 2) {
            delete todo._id;
            delete todo.createdAt;
            await this.todoService.todoModel.update({ longtimekey: rt.longtimekey, user: user.id }, todo, { multi: true });
        }
        return rt;
    }
    async deleteTodo(id, user) {
        const rt = await this.todoService.todoModel.findOneAndRemove({ user: user.id, _id: id });
        if (rt.type === 2) {
            await this.todoService.todoModel.deleteMany({ user: user.id, longtimekey: rt.longtimekey });
        }
        return true;
    }
};
__decorate([
    routing_controllers_1.Post('/todo'),
    __param(0, routing_controllers_1.BodyParam('type', { required: true })),
    __param(1, routing_controllers_1.BodyParam('content', { required: true })),
    __param(2, routing_controllers_1.BodyParam('rank', { required: true })),
    __param(3, routing_controllers_1.BodyParam('createdAt', { required: true })),
    __param(4, routing_controllers_1.BodyParam('endAt')),
    __param(5, routing_controllers_1.State('user')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, String, Number, String, String, Object]),
    __metadata("design:returntype", Promise)
], TodoController.prototype, "createTodo", null);
__decorate([
    routing_controllers_1.Get('/todo/:date'),
    __param(0, routing_controllers_1.Param('date')),
    __param(1, routing_controllers_1.State('user')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], TodoController.prototype, "getTodos", null);
__decorate([
    routing_controllers_1.Get('/todo/date/:year_month'),
    __param(0, routing_controllers_1.Param('year_month')), __param(1, routing_controllers_1.State('user')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], TodoController.prototype, "getTodosDateSet", null);
__decorate([
    routing_controllers_1.Put('/todo/:id'),
    __param(0, routing_controllers_1.Param('id')),
    __param(1, routing_controllers_1.Body()),
    __param(2, routing_controllers_1.State('user')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Object]),
    __metadata("design:returntype", Promise)
], TodoController.prototype, "UpdateTodo", null);
__decorate([
    routing_controllers_1.Delete('/todo/:id'),
    __param(0, routing_controllers_1.Param('id')),
    __param(1, routing_controllers_1.State('user')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], TodoController.prototype, "deleteTodo", null);
TodoController = __decorate([
    routing_controllers_1.JsonController(),
    __metadata("design:paramtypes", [todo_service_1.TodoService])
], TodoController);
exports.TodoController = TodoController;
//# sourceMappingURL=todo.controller.js.map