import {Service} from "typedi"
import {Model} from "mongoose"
import {ITodo, Todo} from "../model/Todo"

@Service()
export class TodoService {
    public todoModel: Model<ITodo>

    constructor() {
        this.todoModel = Todo
    }
}