import {UserAdminController, UserController} from "../../app/controllers";

import * as Router from "koa-router";

import {Environment} from "../environments";


const router = new Router();

const adminRouter = new Router();

router
    .post('/user/friend', UserController.addFriend)
    .post('/login', UserController.wechatLogin);

adminRouter
    .post('/admin/login', UserAdminController.login);


if (Environment.identity !== 'production') adminRouter.post('/admin/user', UserAdminController.createuser);

export const userRouter = router.use(adminRouter.routes());