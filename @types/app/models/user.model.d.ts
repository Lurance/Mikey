/// <reference types="mongoose" />
import { Document, Model } from 'mongoose';
export declare enum Usertype {
    administrator = 1,
    customer = 2,
}
export declare enum OpenStatus {
    NotOpen = 0,
    OpenTodos = 1,
    Openprogress = 2,
    All = 3,
}
export interface IUser extends Document {
    username?: string;
    openid?: string;
    password?: string;
    usertype: Usertype;
    friendkey: string;
    friendIds: Array<IUser>;
    openstatus: OpenStatus;
    meta: {
        createdAt: string;
    };
}
export declare const User: Model<IUser>;
