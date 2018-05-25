import {Get, JsonController, Param, QueryParam, State} from "routing-controllers"

import {UserService} from "../service/user.service"

import {Payload} from "../model/User"

import {TodoService} from "../service/todo.service"

@JsonController()
export class ShareController {
    constructor(private userService: UserService,
                private todoService: TodoService) {

    }

    @Get('/share/:uid')
    async getShareInfofromUser(@Param('uid') uid: string,
                               @State('user') user: Payload,
                               @QueryParam('shareKey') shareKey: string) {

    }
}