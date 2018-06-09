"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
const routing_controllers_1 = require("routing-controllers");
const axios_1 = require("axios");
const weChat_1 = require("../config/weChat");
const user_service_1 = require("../service/user.service");
const md5 = require("js-md5");
const environments_1 = require("../config/environments");
const ms = require("ms");
let UserController = class UserController {
    constructor(userService) {
        this.userService = userService;
    }
    async wechatLogin(code) {
        try {
            const res = await axios_1.default.get(`https://api.weixin.qq.com/sns/jscode2session?appid=${weChat_1.default.appid}&secret=${weChat_1.default.appsecret}&js_code=${code}&grant_type=authorization_code`);
            const openid = res.data.openid;
            const oldUser = await this.userService.userModel.findOne({ openid: openid });
            if (oldUser) {
                return this.userService.signUser(oldUser);
            }
            else {
                const newUser = await this.userService.createNewCustomer(openid);
                return this.userService.signUser(newUser);
            }
        }
        catch (e) {
            console.log(e);
            throw new routing_controllers_1.UnauthorizedError();
        }
    }
    async saveUserInfoFromWechat(avatarUrl, nickName, user) {
        await this.userService.userModel.update({ _id: user.id }, {
            avatarUrl: avatarUrl,
            nickName: nickName
        });
    }
    shareEvaluate(user, shareKey) {
        this.userService.shareModel.create({
            user: user.id,
            key: shareKey,
            expiresAt: Date.now() + ms(environments_1.Environment.shareKeyExpires)
        });
    }
    async getShareEvaluateData(shareKey) {
        const s = await this.userService.shareModel.findOne({ key: shareKey })
            .populate('user');
        if (new Date() > s.expiresAt) {
            throw new routing_controllers_1.BadRequestError();
        }
        else {
            const data = await this.userService.getEvaluateDataFromUser(s.user._id);
            return {
                data: data,
                avatarUrl: s.user.avatarUrl,
                nickName: s.user.nickName
            };
        }
    }
};
__decorate([
    routing_controllers_1.Post('/login'),
    __param(0, routing_controllers_1.BodyParam('code', { required: true })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "wechatLogin", null);
__decorate([
    routing_controllers_1.Post('/userinfo'),
    routing_controllers_1.OnUndefined(204),
    __param(0, routing_controllers_1.BodyParam('avatarUrl', { required: true })),
    __param(1, routing_controllers_1.BodyParam('nickName', { required: true })),
    __param(2, routing_controllers_1.State('user')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "saveUserInfoFromWechat", null);
__decorate([
    routing_controllers_1.Post('/share'),
    routing_controllers_1.OnUndefined(204),
    __param(0, routing_controllers_1.State('user')), __param(1, routing_controllers_1.BodyParam('shareKey', { required: true })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", void 0)
], UserController.prototype, "shareEvaluate", null);
__decorate([
    routing_controllers_1.Get('/share/:shareKey'),
    __param(0, routing_controllers_1.Param('shareKey')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "getShareEvaluateData", null);
UserController = __decorate([
    routing_controllers_1.JsonController(),
    __metadata("design:paramtypes", [user_service_1.UserService])
], UserController);
exports.UserController = UserController;
let UserAdminController = class UserAdminController {
    constructor(userService) {
        this.userService = userService;
    }
    async doAdminLogin(username, password) {
        const u = await this.userService.userModel.findOne({ username: username, password: md5(password), usertype: 1 });
        if (u) {
            return this.userService.signUser(u);
        }
        else {
            throw new routing_controllers_1.UnauthorizedError();
        }
    }
    async createAdministrator(username, password) {
        if (environments_1.Environment.identity === 'development') {
            if (await this.userService.userModel.count({ username: username })) {
                throw new routing_controllers_1.BadRequestError('重复的用户名');
            }
            else {
                return await this.userService.userModel.create({
                    username: username,
                    password: password,
                    usertype: 1
                });
            }
        }
        else {
            throw new routing_controllers_1.BadRequestError();
        }
    }
};
__decorate([
    routing_controllers_1.Post('/login'),
    __param(0, routing_controllers_1.BodyParam('username', { required: true })), __param(1, routing_controllers_1.BodyParam('password', { required: true })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], UserAdminController.prototype, "doAdminLogin", null);
__decorate([
    routing_controllers_1.Post('/admin_user'),
    __param(0, routing_controllers_1.BodyParam('username', { required: true })),
    __param(1, routing_controllers_1.BodyParam('password', { required: true })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], UserAdminController.prototype, "createAdministrator", null);
UserAdminController = __decorate([
    routing_controllers_1.JsonController(),
    __metadata("design:paramtypes", [user_service_1.UserService])
], UserAdminController);
exports.UserAdminController = UserAdminController;
//# sourceMappingURL=user.controller.js.map