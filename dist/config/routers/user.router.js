"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const controllers_1 = require("../../app/controllers");
const Router = require("koa-router");
const router = new Router();
const adminRouter = new Router();
router
    .get('/t', controllers_1.UserController.t)
    .post('/login', controllers_1.UserController.wechatLogin);
adminRouter
    .post('/admin/login', controllers_1.UserAdminController.login);
exports.userRouter = router.use(adminRouter.routes());
//# sourceMappingURL=user.router.js.map