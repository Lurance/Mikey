import {Get, JsonController, State} from "routing-controllers"
import {Payload} from "../model/User"
import {UserService} from "../service/user.service"


@JsonController()
export class EvaluateController {
    constructor(private userService: UserService) {
    }

    @Get('/evaluate')
    getEvaluateInfo(@State('user') user: Payload): Promise<any> {
        return this.userService.getEvaluateDataFromUser(user.id)
    }
}