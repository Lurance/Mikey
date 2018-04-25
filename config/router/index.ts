import * as Router from "koa-router";

import {userRouter} from "./user.router";

const router = new Router();

router.use('/api/v1', userRouter.routes(), userRouter.allowedMethods());

export default router