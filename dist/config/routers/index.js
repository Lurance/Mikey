"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Router = require("koa-router");
const user_router_1 = require("./user.router");
const router = new Router();
router.use('/api/v1', user_router_1.userRouter.routes(), user_router_1.userRouter.allowedMethods());
exports.default = router;
//# sourceMappingURL=index.js.map