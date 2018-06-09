import {
    BadRequestError,
    BodyParam, Get,
    JsonController, OnUndefined, Param,
    Post, State,
    UnauthorizedError
} from "routing-controllers"

import Axios from "axios"

import wechatConfig from '../config/weChat'

import {IUser, Payload, UserType} from "../model/User"

import {UserService} from "../service/user.service"

import * as md5 from "js-md5"

import {Environment} from "../config/environments"

import ms = require("ms")

@JsonController()
export class UserController {
    constructor(private userService: UserService) {
    }

    @Post('/login')
    async wechatLogin(@BodyParam('code', {required: true}) code: string): Promise<{usertype: UserType, jwt: {token: string, expiresOn: number}}> {
        try {
            const res = await Axios.get(`https://api.weixin.qq.com/sns/jscode2session?appid=${wechatConfig.appid}&secret=${wechatConfig.appsecret}&js_code=${code}&grant_type=authorization_code`)
            const openid = res.data.openid
            const oldUser = await this.userService.userModel.findOne({openid: openid})
            if (oldUser) {
                return this.userService.signUser(oldUser)
            } else {
                const newUser = await this.userService.createNewCustomer(openid)
                return this.userService.signUser(newUser)
            }
        } catch (e) {
            console.log(e)
            throw new UnauthorizedError()
        }
    }

    @Post('/userinfo')
    @OnUndefined(204)
    async saveUserInfoFromWechat(@BodyParam('avatarUrl', {required: true}) avatarUrl: string,
                                 @BodyParam('nickName', {required: true}) nickName: string,
                                 @State('user') user: Payload): Promise<void> {
        await this.userService.userModel.update({_id: user.id}, {
            avatarUrl: avatarUrl,
            nickName: nickName
        })
    }

    @Post('/share')
    @OnUndefined(204)
    shareEvaluate(@State('user') user: Payload, @BodyParam('shareKey', {required: true}) shareKey: string): void {
        this.userService.shareModel.create({
            user: user.id,
            key: shareKey,
            expiresAt: Date.now() + ms(Environment.shareKeyExpires)
        })
    }

    @Get('/share/:shareKey')
    async getShareEvaluateData(@Param('shareKey') shareKey: string) {
        const s = await this.userService.shareModel.findOne({key: shareKey})
            .populate('user')

        if (new Date() > s.expiresAt) {
            throw new BadRequestError()
        } else {
            const data = await this.userService.getEvaluateDataFromUser((s.user as IUser)._id)
            return {
                data: data,
                avatarUrl: (s.user as IUser).avatarUrl,
                nickName: (s.user as IUser).nickName
            }
        }
    }
}

@JsonController()
export class UserAdminController {
    constructor(private userService: UserService) {
    }

    @Post('/login')
    async doAdminLogin(@BodyParam('username', {required: true}) username: string, @BodyParam('password', {required: true}) password: string): Promise<{usertype: UserType, jwt: {token: string, expiresOn: number}}> {
        const u = await this.userService.userModel.findOne({username: username, password: md5(password), usertype: 1})
        if (u) {
            return this.userService.signUser(u)
        } else {
            throw new UnauthorizedError()
        }
    }

    @Post('/admin_user')
    async createAdministrator(@BodyParam('username', {required: true}) username: string,
                              @BodyParam('password', {required: true}) password: string
    ) {
        if (Environment.identity === 'development') {
            if (await this.userService.userModel.count({username: username})) {
                throw new BadRequestError('重复的用户名')
            } else {
                return await this.userService.userModel.create({
                    username: username,
                    password: password,
                    usertype: 1
                })
            }
        } else {
            throw new BadRequestError()
        }
    }


}