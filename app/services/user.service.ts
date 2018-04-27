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
        const token = sign({openid: user.openid, usertype: user.usertype, username: user.username, friendkey: user.friendkey}, Environment.jwtsecret, {
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

    static async makeFriend(fromFriendKey: string, toFriendKey: string): Promise<object> {
        const toUser = await User.findOne({friendkey: toFriendKey});
        const fromUser = await User.findOne({friendkey: fromFriendKey});

        if (fromUser.friendIds.findIndex(v => v._id.toString() === toUser._id.toString()) !== -1) {
            throw createHttpError(400, '已添加过该好友')
        }

        await fromUser.update({$push: {friendIds: {username: toUser.username, _id: toUser._id}}});
        await toUser.update({$push: {friendIds: {username: fromUser.username, _id: fromUser._id}}});
        return {
            username: toUser.username,
            _id: toUser._id
        }
    }
}