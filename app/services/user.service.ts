import {IUser, User} from "../models";

import {sign} from "jsonwebtoken";

import {Environment} from "../../config/environments";

import ms = require("ms");

import * as md5 from "js-md5";

import * as createHttpError from "http-errors";

export class UserService {
    static async createUser(userinfo: IUser): Promise<IUser> {
        const u = new User(userinfo);
        return await u.save()
    }

    static async getUserFromOrCreate(condition: any): Promise<IUser> {
        const u = await User.findOne(condition);
        if (u) return u;
        return await UserService.createUser(condition);
    }

    static genJWToken(user: IUser): object {
        const token = sign({openid: user.openid, usertype: user.usertype}, Environment.jwtsecret, {
            expiresIn: Environment.expiresIn
        });
        return {
            token: token,
            expiresIn: Date.now() + ms(Environment.expiresIn)
        }
    }

    static async authUser(username: string, password: string, usertype: number): Promise<object> {
        const u = await User.findOne({username: username, password: md5(password), usertype: usertype});
        if (u) return UserService.genJWToken(u);
        throw createHttpError(401, '认证失败')
    }
}