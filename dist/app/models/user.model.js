"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const utils_1 = require("../utils");
const md5 = require("js-md5");
var Usertype;
(function (Usertype) {
    Usertype[Usertype["administrator"] = 1] = "administrator";
    Usertype[Usertype["customer"] = 2] = "customer";
})(Usertype = exports.Usertype || (exports.Usertype = {}));
var OpenStatus;
(function (OpenStatus) {
    OpenStatus[OpenStatus["NotOpen"] = 0] = "NotOpen";
    OpenStatus[OpenStatus["OpenTodos"] = 1] = "OpenTodos";
    OpenStatus[OpenStatus["Openprogress"] = 2] = "Openprogress";
    OpenStatus[OpenStatus["All"] = 3] = "All";
})(OpenStatus = exports.OpenStatus || (exports.OpenStatus = {}));
const userSchema = new mongoose_1.Schema({
    username: {
        type: String,
        required: false
    },
    openid: {
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
        required: true
    },
    friendkey: {
        type: String,
        required: false
    },
    friendIds: [{
            type: mongoose_1.Schema.Types.Mixed
        }],
    openstatus: {
        type: Number,
        required: true,
        default: 0
    },
    meta: {
        createdAt: {
            type: Date,
            default: Date.now
        }
    }
});
userSchema.pre('save', function (next) {
    this.friendkey = utils_1.genNonDuplicateID(5);
    if (this.password) {
        this.password = md5(this.password);
    }
    next();
});
exports.User = mongoose_1.model('User', userSchema);
//# sourceMappingURL=user.model.js.map