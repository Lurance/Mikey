import { IUser } from "../models";
export declare class UserService {
    static createUser(userinfo: IUser): Promise<IUser>;
    static getUserFromOrCreate(condition: any): Promise<IUser>;
    static genJWToken(user: IUser): object;
    static authUser(username: string, password: string, usertype: number): Promise<object>;
}
