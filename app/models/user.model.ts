import {Document, model, Model, Schema} from 'mongoose'

export enum Usertype {
    administrator = 1,
    customer
}

export interface IUser extends Document{
    username?: string,
    openid?: string,
    password?: string,
    usertype: Usertype
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
    }
});

export const User: Model<IUser> = model<IUser>('User', userSchema);