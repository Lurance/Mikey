"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const conn_1 = require("../config/conn");
const mongoose_1 = require("mongoose");
const shareSchema = new mongoose_1.Schema({
    user: {
        type: mongoose_1.Schema.Types.ObjectId,
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
});
exports.Share = conn_1.mongoose.model('Share', shareSchema);
//# sourceMappingURL=Share.js.map