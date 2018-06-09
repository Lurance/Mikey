import {mongoose} from "../config/conn"
import {Schema} from "mongoose"
import {genNonDuplicateID} from "../helpers/genNonDuplicateID"
import {IUser} from "./User"

export interface IShare extends mongoose.Document {
    user: string | IUser,
    key: string,
    createdAt: Date,
    expiresAt: Date
}


const shareSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    key: {
        type: String,
        required: false
    },
    createdAt: {
        type: Date,
        required: true,
        default: Date.now
    },
    expiresAt: {
        type: Date,
        required: true
    }
})

export const Share = mongoose.model<IShare>('Share', shareSchema)
