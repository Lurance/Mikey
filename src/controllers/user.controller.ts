import {
    BadRequestError,
    BodyParam,
    JsonController,
    Post,
    UnauthorizedError
} from "routing-controllers"

import Axios from "axios"

import wechatConfig from '../config/weChat'

import {UserType} from "../model/User"

import {UserService} from "../service/user.service"

import * as md5 from "js-md5"

import {Environment} from "../config/environments"


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