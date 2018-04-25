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
const models_1 = require("../models");
const jsonwebtoken_1 = require("jsonwebtoken");
const environments_1 = require("../../config/environments");
const ms = require("ms");
const md5 = require("js-md5");
const createHttpError = require("http-errors");
class UserService {
    static createUser(userinfo) {
        return __awaiter(this, void 0, void 0, function* () {
            const u = new models_1.User(userinfo);
            return yield u.save();
        });
    }
    static getUserFromOrCreate(condition) {
        return __awaiter(this, void 0, void 0, function* () {
            const u = yield models_1.User.findOne(condition);
            if (u)
                return u;
            return yield UserService.createUser(condition);
        });
    }
    static genJWToken(user) {
        const token = jsonwebtoken_1.sign({ openid: user.openid, usertype: user.usertype }, environments_1.Environment.jwtsecret, {
            expiresIn: environments_1.Environment.expiresIn
        });
        return {
            token: token,
            expiresIn: Date.now() + ms(environments_1.Environment.expiresIn)
        };
    }
    static authUser(username, password, usertype) {
        return __awaiter(this, void 0, void 0, function* () {
            const u = yield models_1.User.findOne({ username: username, password: md5(password), usertype: usertype });
            if (u)
                return UserService.genJWToken(u);
            throw createHttpError(401, '认证失败');
        });
    }
}
exports.UserService = UserService;
//# sourceMappingURL=user.service.js.map