import {Document, model, Model, Schema} from "mongoose";

export enum Rank {
    default = 0,
    blue = 1,
    yellow = 2,
    red = 3
}

export interface ITodo extends Document {
    userId: string;
    content: string;
    deadline?: string;
    rank: Rank;
    hasDone: boolean;
    hasDele: boolean;
}

const todoSchema: Schema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    content: {
        type: String,
        required: true
    },
    deadline: {
        type: Date,
        required: false
    },
    rank: {
        type: Number,
        required: true,
        default: 0
    },
    hasDone: {
        type: Boolean,
        required: true,
        default: false
    },
    hasDel: {
        type: Boolean,
        required: true,
        default: false
    },
    meta: {
        createdAt: {
            type: Date,
            required: true,
            default: Date.now
        }
    }
});

export const Todo: Model<ITodo> = model<ITodo>('Todo', todoSchema);