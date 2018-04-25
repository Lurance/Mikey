"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const production_1 = require("./production");
const development_1 = require("./development");
const test_1 = require("./test");
const isProd = process.env.NODE_ENV === 'production';
const isTest = process.env.NODE_ENV === 'test';
const env = isTest ? test_1.default : (isProd ? production_1.default : development_1.default);
exports.Environment = env;
//# sourceMappingURL=index.js.map