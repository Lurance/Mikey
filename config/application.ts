import * as Koa from 'koa'

import * as bodyParser from "koa-bodyparser";

export const createServer = async () => {
    const app = new Koa();

    app.use(bodyParser());

    return app
};