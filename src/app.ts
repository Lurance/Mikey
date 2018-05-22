import "reflect-metadata"

import * as Koa from 'koa'

import {useContainer, useKoaServer} from "routing-controllers"

import {UserAdminController, UserController} from "./controllers/user.controller"

import {Environment} from "./config/environments"

import * as json from "koa-json"

import * as cors from "koa2-cors"

import * as jwt from "koa-jwt"

import {Action} from "routing-controllers/Action"

import {Container} from "typedi"

import {TodoController} from "./controllers/todo.controller"

import {HomeController} from "./controllers/home.controller"

useContainer(Container)

export const createHttpServer = async () => {

    const koa = new Koa()


    if (Environment.identity  !== 'production') koa.use(json())

    koa.use(cors())

    koa.use(jwt({
        secret: Environment.jwtSecret
    }).unless({
        path: [
            /\/api\/login/,
            (() => {if (Environment.identity === 'development') return /\/admin\/api\/admin_user/ })()
        ]
    }))



    useKoaServer(koa, {
        routePrefix: '/api',
        controllers: [
            UserController,
            TodoController,
            HomeController
        ],
        classTransformer: false,
        development: true
    })

    useKoaServer(koa, {
        routePrefix: '/admin/api',
        controllers: [
            UserAdminController,
        ],
        classTransformer: false,
        development: true,
        authorizationChecker: async (action: Action, roles: any[]): Promise<boolean> => {
            const payload = action.context.state.user || null
            if (payload) {
                if (payload.expiresOn > Date.now() && payload.usertype === 1) {
                    return true
                }
            }
            return false
        }
    })

    return koa

};