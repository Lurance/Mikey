"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
process.env.NODE_ENV = 'test';
const server = require("../app");
const chai = require("chai");
const chaiHttp = require("chai-http");
chai.use(chaiHttp);
let timer;
const closeServer = () => {
    timer && clearTimeout(timer);
    timer = setTimeout(() => {
        process.exit(0);
        clearTimeout(timer);
    }, 2000);
};
exports.app = () => __awaiter(this, void 0, void 0, function* () {
    closeServer();
    return chai.request(yield server);
});
//# sourceMappingURL=base.js.map