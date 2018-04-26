"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
var Usertype;
(function (Usertype) {
    Usertype[Usertype["administrator"] = 1] = "administrator";
    Usertype[Usertype["customer"] = 2] = "customer";
})(Usertype = exports.Usertype || (exports.Usertype = {}));
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
    meta: {
        createdAt: {
            type: Date,
            default: Date.now
        }
    }
});
exports.User = mongoose_1.model('User', userSchema);
//# sourceMappingURL=user.model.js.map