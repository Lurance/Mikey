"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
var Rank;
(function (Rank) {
    Rank[Rank["default"] = 0] = "default";
    Rank[Rank["blue"] = 1] = "blue";
    Rank[Rank["yellow"] = 2] = "yellow";
    Rank[Rank["red"] = 3] = "red";
})(Rank = exports.Rank || (exports.Rank = {}));
const todoSchema = new mongoose_1.Schema({
    userId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    content: {
        type: String,
        required: true
    },
    deadline: {
        type: Date,
        required: false
    },
    rank: {
        type: Number,
        required: true,
        default: 0
    },
    hasDone: {
        type: Boolean,
        required: true,
        default: false
    },
    hasDel: {
        type: Boolean,
        required: true,
        default: false
    },
    meta: {
        createdAt: {
            type: Date,
            required: true,
            default: Date.now
        }
    }
});
exports.Todo = mongoose_1.model('Todo', todoSchema);
//# sourceMappingURL=todo.model.js.map