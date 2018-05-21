import {genNonDuplicateID} from "../helpers/genNonDuplicateID"
import {Schema} from "mongoose"
import {mongoose} from "../config/conn"
import md5 = require("js-md5")

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

export interface IUser extends mongoose.Document {
    openid?: string;
    username?: string;
    password?: string;
    usertype: Usertype;
    friendkey: string;
    friends?: IUser[];
    openstatus: OpenStatus;
    integral: number;
}

const userSchema = new Schema({
    openid: {
        type: String,
        required: false
    },
    username: {
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
        required: true,
    },
    friendkey: {
        type: String,
        required: true,
        default: genNonDuplicateID(5)
    },
    openstatus: {
        type: Number,
        required: true,
        default: 0
    },
    friends: [Schema.Types.Mixed],
    integral: {
        type: Number,
        default: 0,
        required: true
    }
})

userSchema.pre<IUser>('save', function (next) {
    if (this.password) {
        this.password = md5(this.password);
    }
    next()
});

export const User = mongoose.model<IUser>('User', userSchema)