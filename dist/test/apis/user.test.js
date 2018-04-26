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
const base_1 = require("../base");
const chai_1 = require("chai");
const jsonwebtoken_1 = require("jsonwebtoken");
const environments_1 = require("../../config/environments");
describe('TEST USER APIS', () => {
    beforeEach(() => __awaiter(this, void 0, void 0, function* () {
        this.server = yield base_1.app();
    }));
    it('AUTH FOR ADMINISTRATOR BY DEFAULT USERNAME&PASSWORD', () => __awaiter(this, void 0, void 0, function* () {
        const res = yield this.server.post('/api/v1/admin/login')
            .send({ username: environments_1.Environment.defaultUsername, password: environments_1.Environment.defaultPassword });
        chai_1.expect(res.status).equal(200);
        chai_1.expect(res.body).to.have.property('jwt');
        const payload = jsonwebtoken_1.verify(res.body.jwt.token, environments_1.Environment.jwtsecret);
        chai_1.expect(payload.username).equal('admin');
        chai_1.expect(payload.usertype).equal(1);
    }));
    it('AUTH FOR ADMINISTRATOR BY WRONG SERNAME&PASSWORD', () => __awaiter(this, void 0, void 0, function* () {
        const res = yield this.server.post('/api/v1/admin/login')
            .send({ username: 'vnwoen 423 啊啊啊 哈哈 ！#', password: '  3423cckwergpo4jr∫∆ˆˆ≈˚©∫' });
        chai_1.expect(res.status).equal(401);
    }));
    it('AUTH FOR CUSTOMER BY WRONG CODE', () => __awaiter(this, void 0, void 0, function* () {
        const res = yield this.server.post('/api/v1/login')
            .send({ code: 'cv;qwefkop4opf  的\'' });
        chai_1.expect(res.status).equal(401);
    }));
});
//# sourceMappingURL=user.test.js.map