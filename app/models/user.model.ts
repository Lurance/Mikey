import {Document, model, Model, Schema} from 'mongoose'

import {genNonDuplicateID} from "../utils";
import * as md5 from "js-md5";

export enum Usertype {
    administrator = 1,
    customer
}

export enum OpenStatus {
    NotOpen = 0,
    OpenTodos,
    Openprogress,
    All
}

export interface IUser extends Document{
    username?: string;
    openid?: string;
    password?: string;
    usertype: Usertype;
    friendkey: string;
    friendIds: Array<IUser>;
    openstatus: OpenStatus;
    meta: {
        createdAt: string
    }
}

const userSchema: Schema = new Schema({
    username: {
        type: String,
        required: false
    },
    openid: {
        type: String,
        required: false
    },
    password: {
        type: String,
        required: false
    },
    usertype: {
        type: Number,
        default: 2,
        required: true
    },
    friendkey: {
        type: String,
        required: false
    },
    friendIds: [{
        type: Schema.Types.Mixed
    }],
    openstatus: {
        type: Number,
        required: true,
        default: 0
    },
    meta: {
        createdAt: {
            type: Date,
            default: Date.now
        }
    }
});

userSchema.pre<IUser>('save', function (next) {
    this.friendkey = genNonDuplicateID(5);
    if (this.password) {
        this.password = md5(this.password);
    }
    next()
});

export const User: Model<IUser> = model<IUser>('User', userSchema);