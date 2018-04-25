import * as Koa from 'koa'

import * as bodyParser from "koa-bodyparser";

import './connection'

import router from "./router";

import {Environment} from "./environments";

import * as json from "koa-json";

import * as jwt from "koa-jwt";

export const createServer = async () => {
    const app = new Koa();

    app.use(bodyParser());

    Environment.identity !== 'production' && app.use(json());

    app.use(jwt({secret: Environment.jwtsecret}).unless({
        path: [
            /\/api\/v1\/login/,
            /\/api\/v1\/admin\/login/
        ]
    }))

    app.use(router.routes()).use(router.allowedMethods());

    return app
};