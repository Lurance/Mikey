import {Service} from "typedi"
import {Model} from "mongoose"
import {ITodo, Todo} from "../model/Todo"
import ms = require("ms")
import {genNonDuplicateID} from "../helpers/genNonDuplicateID"

@Service()
export class TodoService {
    public todoModel: Model<ITodo>

    constructor() {
        this.todoModel = Todo
    }

    public async createDefaultTodo(userId: string): Promise<void> {
        // 新用户生成默认的Todo，用于指引

        await this.todoModel.create({
            user: userId,
            content: '欢迎使用Peggy',
            rank: 0,
            type: 1
        })

        await this.todoModel.create({
            user: userId,
            content: '在我上面向左滑动删除',
            rank: 0,
            type: 1
        })

        await this.todoModel.create({
            user: userId,
            content: '向右滑动修改完成状态',
            rank: 0,
            type: 1
        })

        await this.todoModel.create({
            user: userId,
            content: '点击上方左侧的按钮可以进入日程评估分析视图',
            rank: 0,
            type: 1
        })

        await this.todoModel.create({
            user: userId,
            content: '点击上方右侧的按钮可以进入日程总结日历视图并添加新的日程',
            rank: 0,
            type: 1
        })
    }

    public async generateLongTimeTodo(todo: ITodo, longtimekey: string): Promise<void> {

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
            })
        }
    }

}