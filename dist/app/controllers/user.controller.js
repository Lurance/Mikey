"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const axios_1 = require("axios");
const wechat_config_1 = require("../../config/wechat.config");
const createHttpError = require("http-errors");
const services_1 = require("../services");
class UserController {
    static wechatLogin(ctx) {
        return __awaiter(this, void 0, void 0, function* () {
            const code = ctx.request.body.code;
            yield axios_1.default.get(`https://api.weixin.qq.com/sns/jscode2session?appid=${wechat_config_1.wechatConfig.appid}&secret=${wechat_config_1.wechatConfig.appsecret}&js_code=${code}&grant_type=authorization_code`)
                .then((res) => __awaiter(this, void 0, void 0, function* () {
                if ('openid' in res.data) {
                    const user = yield services_1.UserService.getUserFromOrCreate({ usertype: 2, openid: res.data.openid });
                    ctx.body = {
                        jwt: yield services_1.UserService.genJWToken(user),
                        username: user.username
                    };
                }
                else {
                    throw createHttpError(401, `微信认证失败 ${res.data.errmsg}`);
                }
            }))
                .catch((err) => {
                console.log(err);
                throw createHttpError(401, err.message);
            });
        });
    }
    static addFriend(ctx) {
        return __awaiter(this, void 0, void 0, function* () {
            const { friendkey } = ctx.request.body;
            ctx.body = yield services_1.UserService.makeFriend(ctx.state.user.friendkey, friendkey);
        });
    }
}
exports.UserController = UserController;
class UserAdminController {
    static login(ctx) {
        return __awaiter(this, void 0, void 0, function* () {
            const { username, password } = ctx.request.body;
            ctx.body = {
                jwt: yield services_1.UserService.authUser(username, password, 1),
                username: username,
                usertype: 1
            };
        });
    }
    static createuser(ctx) {
        return __awaiter(this, void 0, void 0, function* () {
            const { username, password } = ctx.request.body;
            ctx.body = yield services_1.UserService.getUserFromOrCreate({ username: username, password: password, usertype: 1 });
        });
    }
}
exports.UserAdminController = UserAdminController;
//# sourceMappingURL=user.controller.js.map