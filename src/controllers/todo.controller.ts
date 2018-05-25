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
import {genNonDuplicateID} from "../helpers/genNonDuplicateID"

@JsonController()
export class TodoController {
    constructor(private todoService: TodoService) {
    }

    @Post('/todo')
    async createTodo(@BodyParam('type', {required: true}) type: TodoType,
                     @BodyParam('content', {required: true}) content: string,
                     @BodyParam('rank', {required: true}) rank: TodoRank,
                     @BodyParam('createdAt', {required: true}) createdAt: string,
                     @BodyParam('endAt') endAt: string,
                     @State('user') user: Payload
    ): Promise<ITodo> {
        const newTodo =  await this.todoService.todoModel.create({
            user: user.id,
            type: type,
            createdAt: createdAt,
            content: content.trim(),
            rank: rank,
            endAt: endAt,
        })
        if (newTodo.type === 2) {
            const longtimekey = genNonDuplicateID(5)
            await newTodo.update({longtimekey: longtimekey})
            this.todoService.generateLongTimeTodo(newTodo, longtimekey)
        }
        return newTodo
    }


    @Get('/todo/:date')
    async getTodos(@Param('date') date: string,
                   @State('user') user: Payload
    ): Promise<ITodo[]> {
        return await this.todoService.todoModel.find({
            createdAt: {
                $gte: new Date(date).getTime(),
                $lt: new Date(date).getTime() + ms('1d')

            },
            user: user.id
        })
    }

    @Get('/todo/date/:year_month')
    async getTodosDateSet(@Param('year_month') year_month: string, @State('user') user: Payload) {
        let res = []
        await this.todoService.todoModel.find({user: user.id, createdAt: {$gte: new Date(year_month).getTime(), $lte: new Date(year_month).getTime() + ms('31d')}})
            .then(data => {
                data.forEach(t => {
                    res.push(`${t.createdAt.getFullYear()}/${t.createdAt.getMonth() + 1}/${t.createdAt.getDate()}`)
                })
            })


        return Array.from(new Set(res))
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
    async deleteTodo(@Param('id') id: string,
                     @State('user') user: Payload): Promise<boolean> {

        const rt = await this.todoService.todoModel.findOneAndRemove({user: user.id, _id: id})
        if (rt.type === 2) {
            await this.todoService.todoModel.deleteMany({user: user.id, longtimekey: rt.longtimekey})
        }
        return true
    }
}