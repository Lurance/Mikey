"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const genNonDuplicateID_1 = require("../helpers/genNonDuplicateID");
const mongoose_1 = require("mongoose");
const conn_1 = require("../config/conn");
const md5 = require("js-md5");
var UserType;
(function (UserType) {
    UserType[UserType["administrator"] = 1] = "administrator";
    UserType[UserType["customer"] = 2] = "customer";
})(UserType = exports.UserType || (exports.UserType = {}));
var OpenStatus;
(function (OpenStatus) {
    OpenStatus[OpenStatus["NotOpen"] = 0] = "NotOpen";
    OpenStatus[OpenStatus["OpenTodos"] = 1] = "OpenTodos";
    OpenStatus[OpenStatus["Openprogress"] = 2] = "Openprogress";
    OpenStatus[OpenStatus["All"] = 3] = "All";
})(OpenStatus = exports.OpenStatus || (exports.OpenStatus = {}));
const userSchema = new mongoose_1.Schema({
    openid: {
        type: String,
        required: false
    },
    username: {
        type: String,
        required: false
    },
    password: {
        type: String,
        required: false
    },
    usertype: {
        type: Number,
        default: 2,
        required: true,
    },
    friendkey: {
        type: String,
        required: false,
    },
    avatarUrl: {
        type: String,
        required: false
    },
    nickName: {
        type: String,
        required: false
    },
    openstatus: {
        type: Number,
        required: true,
        default: 0
    },
    friends: [mongoose_1.Schema.Types.Mixed],
    integral: {
        type: Number,
        default: 0,
        required: true
    }
});
userSchema.pre('save', function (next) {
    this.friendkey = genNonDuplicateID_1.genNonDuplicateID(5);
    if (this.password) {
        this.password = md5(this.password);
    }
    next();
});
exports.User = conn_1.mongoose.model('User', userSchema);
//# sourceMappingURL=User.js.map