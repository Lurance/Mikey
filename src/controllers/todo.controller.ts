import {
    Body,
    BodyParam, Delete,
    Get,
    JsonController, OnUndefined,
    Param,
    Post, Put,
    State
} from "routing-controllers"
import {TodoService} from "../service/todo.service"
import {ITodo, TodoRank, TodoType} from "../model/Todo"
import {Payload} from "../model/User"
import ms = require("ms")

@JsonController()
export class TodoController {
    constructor(private todoService: TodoService) {
    }

    @Post('/todo')
    async createTodo(@BodyParam('type', {required: true}) type: TodoType,
                     @BodyParam('content', {required: true}) content: string,
                     @BodyParam('rank', {required: true}) rank: TodoRank,
                     @BodyParam('endAt') endAt: string,
                     @State('user') user: Payload
    ): Promise<ITodo> {
        return (await this.todoService.todoModel.create({
            user: user.id,
            type: type,
            content: content.trim(),
            rank: rank,
            endAt: endAt,
        })).toJSON()
    }


    @Get('/todo/:date')
    async getTodos(@Param('date') date: string,
                   @State('user') user: Payload
    ): Promise<ITodo[]> {
        return await this.todoService.todoModel.find({
            createdAt: {
                $gte: new Date(date).getTime(),
                $lte: new Date(date).getTime() + ms('1d')
            },
            is_activate: true,
            user: user.id
        })
    }

    @Put('/todo/:id')
    async UpdateTodo(@Param('id') id: string,
                     @Body() todo: ITodo,
                     @State('user') user: Payload)
        : Promise<ITodo> {
        return await this.todoService.todoModel.findOneAndUpdate({
            _id: id,
            user: user.id
        }, todo, {new: true})
    }

    @Delete('/todo/:id')
    @OnUndefined(204)
    async deleteTodo(@Param('id') id: string,
                     @State('user') user: Payload): Promise<void> {
        await this.todoService.todoModel.update({_id: id, user: user.id}, {
            is_activate: false
        })
    }
}