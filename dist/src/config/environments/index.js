"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const dev_1 = require("./dev");
const prod_1 = require("./prod");
const test_1 = require("./test");
const isProd = process.env.NODE_ENV === 'production';
const isTest = process.env.NODE_ENV === 'test';
const env = isTest ? test_1.default : (isProd ? prod_1.default : dev_1.default);
exports.Environment = env;
//# sourceMappingURL=index.js.map