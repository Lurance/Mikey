import {UserAdminController, UserController} from "../../app/controllers";

import * as Router from "koa-router";


const router = new Router();

const adminRouter = new Router();

router
    .get('/t', UserController.t)
    .post('/login', UserController.wechatLogin)

adminRouter
    .post('/admin/login', UserAdminController.login);

export const userRouter =  router.use(adminRouter.routes());