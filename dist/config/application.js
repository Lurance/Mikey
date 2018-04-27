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
const Koa = require("koa");
const bodyParser = require("koa-bodyparser");
require("./connection");
const routers_1 = require("./routers");
const environments_1 = require("./environments");
const json = require("koa-json");
const jwt = require("koa-jwt");
exports.createServer = () => __awaiter(this, void 0, void 0, function* () {
    const app = new Koa();
    app.use(bodyParser());
    environments_1.Environment.identity !== 'production' && app.use(json());
    app.use(jwt({ secret: environments_1.Environment.jwtsecret }).unless({
        path: [
            /\/api\/v1\/login/,
            /\/api\/v1\/admin\/login/,
            /\/api\/v1\/admin\/user/
        ]
    }));
    app.use(routers_1.default.routes()).use(routers_1.default.allowedMethods());
    return app;
});
//# sourceMappingURL=application.js.map