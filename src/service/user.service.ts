import {IUser, Payload, User, UserType} from "../model/User"
import {sign} from "jsonwebtoken"
import {Environment} from "../config/environments"
import ms = require("ms")
import {Service} from "typedi"
import {Model} from "mongoose"
import {TodoService} from "./todo.service"

@Service()
export class UserService {
    public userModel: Model<IUser>

    constructor(private todoService: TodoService) {
        this.userModel = User
    }

    public signUser(user: IUser): {usertype: UserType, jwt: {token: string, expiresOn: number}} {
        const payload = {
            id: user.id,
            openid: user.openid,
            usertype: user.usertype,
            friendkey: user.friendkey,
            expiresOn: Date.now() + ms(Environment.jwtExpires)
        }

        return {
            usertype: user.usertype,
            jwt: {
                token: sign(payload, Environment.jwtSecret, {
                    expiresIn: Environment.jwtExpires
                }),
                expiresOn: Date.now() + ms(Environment.jwtExpires)
            }
        }
    }

    public async createNewCustomer(openid: string): Promise<IUser> {
        const newUser = await this.userModel.create({
            openid: openid
        })
        await this.todoService.createDefaultTodo(newUser._id)
        return newUser
    }
}


