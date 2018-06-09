"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
const Koa = require("koa");
const routing_controllers_1 = require("routing-controllers");
const user_controller_1 = require("./controllers/user.controller");
const environments_1 = require("./config/environments");
const json = require("koa-json");
const cors = require("koa2-cors");
const jwt = require("koa-jwt");
const typedi_1 = require("typedi");
const todo_controller_1 = require("./controllers/todo.controller");
const home_controller_1 = require("./controllers/home.controller");
const evaluate_controller_1 = require("./controllers/evaluate.controller");
routing_controllers_1.useContainer(typedi_1.Container);
exports.createHttpServer = async () => {
    const koa = new Koa();
    if (environments_1.Environment.identity !== 'production')
        koa.use(json());
    koa.use(cors());
    koa.use(jwt({
        secret: environments_1.Environment.jwtSecret
    }).unless({
        path: [
            /\/api\/login/,
            /\/api\/share\/./,
            (() => { if (environments_1.Environment.identity === 'development')
                return /\/admin\/api\/admin_user/; })()
        ]
    }));
    routing_controllers_1.useKoaServer(koa, {
        routePrefix: '/api',
        controllers: [
            user_controller_1.UserController,
            todo_controller_1.TodoController,
            home_controller_1.HomeController,
            evaluate_controller_1.EvaluateController
        ],
        classTransformer: false,
        development: environments_1.Environment.identity === 'development'
    });
    routing_controllers_1.useKoaServer(koa, {
        routePrefix: '/admin/api',
        controllers: [
            user_controller_1.UserAdminController,
        ],
        classTransformer: false,
        development: environments_1.Environment.identity === 'development',
        authorizationChecker: async (action, roles) => {
            const payload = action.context.state.user || null;
            if (payload) {
                if (payload.expiresOn > Date.now() && payload.usertype === 1) {
                    return true;
                }
            }
            return false;
        }
    });
    return koa;
};
//# sourceMappingURL=app.js.map