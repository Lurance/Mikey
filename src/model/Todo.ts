import {Schema} from "mongoose"
import {mongoose} from "../config/conn"

export enum TodoType {
    oneday = 1,
    multiday
}

export enum TodoRank {
    default = 0,
    high,
    veryhigh
}

export interface ITodo extends mongoose.Document {
    type: TodoType,
    content: string,
    rank: TodoRank,
    createdAt: Date,
    endAt: Date,
    is_activate: boolean,
    is_done: boolean,
    user: string
}

const todoSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    type: {
        type: Number,
        required: true,
    },
    content: {
        type: String,
        required: true,
        maxlength: 25
    },
    rank: {
        type: Number,
        required: true
    },
    createdAt: {
        type: Date,
        required: true,
        default: Date.now()
    },
    endAt: {
        type: Date,
        required: function () {
            return this.type === 2
        }
    },
    is_activate: {
        type: Boolean,
        required: true,
        default: true
    },
    is_done: {
        type: Boolean,
        required: true,
        default: false
    }
})

export const Todo = mongoose.model<ITodo>('Todo', todoSchema);