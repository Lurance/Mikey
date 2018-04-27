"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const controllers_1 = require("../../app/controllers");
const Router = require("koa-router");
const environments_1 = require("../environments");
const router = new Router();
const adminRouter = new Router();
router
    .post('/user/friend', controllers_1.UserController.addFriend)
    .post('/login', controllers_1.UserController.wechatLogin);
adminRouter
    .post('/admin/login', controllers_1.UserAdminController.login);
if (environments_1.Environment.identity !== 'production')
    adminRouter.post('/admin/user', controllers_1.UserAdminController.createuser);
exports.userRouter = router.use(adminRouter.routes());
//# sourceMappingURL=user.router.js.map