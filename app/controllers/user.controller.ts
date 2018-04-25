import {Context} from "koa";

import Axios from "axios";

import {wechatConfig} from "../../config/wechat.config";

import * as createHttpError from "http-errors";

import {UserService} from "../services/user.service";

export class UserController {
    static async t(ctx: Context): Promise<void> {
        ctx.body = 't'
    }

    static async at(ctx: Context): Promise<void> {
        ctx.body = 'at'
    }

    static async wechatLogin(ctx: Context): Promise<void> {
        const code = ctx.request.body.code;
        await Axios.get(`https://api.weixin.qq.com/sns/jscode2session?appid=${wechatConfig.appid}&secret=${wechatConfig.appsecret}&js_code=${code}&grant_type=authorization_code`)
            .then(async res => {
                if ('openid' in res.data) {
                    const user = await UserService.getUserFromOrCreate({usertype: 2, openid: res.data.openid});
                    ctx.body = {
                        jwt: await UserService.genJWToken(user),
                        username: user.username
                    }
                } else {
                    throw createHttpError(401, `微信认证失败 ${res.data.errmsg}`)
                }
            })
            .catch((err) => {
                console.log(err);
                throw createHttpError(401, err.message)
            })
    }
}

export class UserAdminController {
    static async login(ctx: Context): Promise<void> {
        const {username, password} = ctx.request.body;
        ctx.body = {
            jwt: await UserService.authUser(username, password, 1),
            username: username,
            usertype: 1
        }
    }
}