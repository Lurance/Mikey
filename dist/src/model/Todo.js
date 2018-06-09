"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const conn_1 = require("../config/conn");
var TodoType;
(function (TodoType) {
    TodoType[TodoType["oneday"] = 1] = "oneday";
    TodoType[TodoType["multiday"] = 2] = "multiday";
})(TodoType = exports.TodoType || (exports.TodoType = {}));
var TodoRank;
(function (TodoRank) {
    TodoRank[TodoRank["default"] = 0] = "default";
    TodoRank[TodoRank["high"] = 1] = "high";
    TodoRank[TodoRank["veryhigh"] = 2] = "veryhigh";
})(TodoRank = exports.TodoRank || (exports.TodoRank = {}));
const todoSchema = new mongoose_1.Schema({
    user: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    type: {
        type: Number,
        required: true,
    },
    content: {
        type: String,
        required: true,
        maxlength: 35
    },
    rank: {
        type: Number,
        required: true
    },
    longtimekey: {
        type: String,
        required: false
    },
    createdAt: {
        type: Date,
        required: true,
        default: Date.now
    },
    endAt: {
        type: Date,
        required: function () {
            return this.type === 2;
        }
    },
    is_done: {
        type: Boolean,
        required: true,
        default: false
    }
});
exports.Todo = conn_1.mongoose.model('Todo', todoSchema);
//# sourceMappingURL=Todo.js.map