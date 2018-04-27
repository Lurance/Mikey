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
const models_1 = require("../../app/models");
const services_1 = require("../../app/services");
describe('UserModule 鉴权 APIS测试  ', () => {
    before(() => __awaiter(this, void 0, void 0, function* () {
        if (yield models_1.User.findOne({ username: environments_1.Environment.defaultUsername }))
            return;
        yield new models_1.User({
            username: environments_1.Environment.defaultUsername,
            password: environments_1.Environment.defaultPassword,
            usertype: 1
        }).save();
    }));
    after(() => __awaiter(this, void 0, void 0, function* () {
        yield models_1.User.remove({ username: environments_1.Environment.defaultUsername });
    }));
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
describe('UserModule 好友 APIS测试', () => {
    before(() => __awaiter(this, void 0, void 0, function* () {
        this.testFriendKeys = [];
        const u1 = yield new models_1.User({
            username: 'TEST1',
            usertype: 2,
        }).save();
        this.testFriendKeys.push({
            username: u1.username,
            friendkey: u1.friendkey,
            jwt: services_1.UserService.genJWToken(u1),
            _id: u1._id
        });
        const u2 = yield new models_1.User({
            username: 'TEST2',
            usertype: 2,
        }).save();
        this.testFriendKeys.push({
            username: u2.username,
            friendkey: u2.friendkey,
            jwt: services_1.UserService.genJWToken(u2),
            _id: u2._id
        });
        const u3 = yield new models_1.User({
            username: 'TEST3',
            usertype: 2,
        }).save();
        this.testFriendKeys.push({
            username: u3.username,
            friendkey: u3.friendkey,
            jwt: services_1.UserService.genJWToken(u3),
            _id: u3._id
        });
    }));
    after(() => __awaiter(this, void 0, void 0, function* () {
        yield models_1.User.remove({ username: { $in: ["TEST1", "TEST2", "TEST3"] } });
    }));
    beforeEach(() => __awaiter(this, void 0, void 0, function* () {
        this.server = yield base_1.app();
    }));
    it('ADD FRIEND TEST1 FRIEND WITH 2', () => __awaiter(this, void 0, void 0, function* () {
        const res = yield this.server.post('/api/v1/user/friend')
            .set('Authorization', `Bearer ${this.testFriendKeys.find(v => v.username === 'TEST1').jwt.token}`)
            .send({ friendkey: this.testFriendKeys.find(v => v.username === "TEST2").friendkey });
        chai_1.expect(res.status).equal(200);
        chai_1.expect(res.body.username).equal('TEST2');
        chai_1.expect(res.body._id).equal(String(this.testFriendKeys.find(v => v.username === 'TEST2')._id));
    }));
    it('ADD FRIEND TEST1 FRIEND WITH 3', () => __awaiter(this, void 0, void 0, function* () {
        const res = yield this.server.post('/api/v1/user/friend')
            .set('Authorization', `Bearer ${this.testFriendKeys.find(v => v.username === 'TEST1').jwt.token}`)
            .send({ friendkey: this.testFriendKeys.find(v => v.username === "TEST3").friendkey });
        chai_1.expect(res.status).equal(200);
        chai_1.expect(res.body.username).equal('TEST3');
        chai_1.expect(res.body._id).equal(String(this.testFriendKeys.find(v => v.username === 'TEST3')._id));
    }));
    it('ADD FRIEND TEST1 FRIEND WITH 2 ANAIN', () => __awaiter(this, void 0, void 0, function* () {
        const res = yield this.server.post('/api/v1/user/friend')
            .set('Authorization', `Bearer ${this.testFriendKeys.find(v => v.username === 'TEST1').jwt.token}`)
            .send({ friendkey: this.testFriendKeys.find(v => v.username === "TEST2").friendkey });
        chai_1.expect(res.status).equal(400);
    }));
    it('ADD FRIEND TEST2 FRIEND WITH 1', () => __awaiter(this, void 0, void 0, function* () {
        const res = yield this.server.post('/api/v1/user/friend')
            .set('Authorization', `Bearer ${this.testFriendKeys.find(v => v.username === 'TEST2').jwt.token}`)
            .send({ friendkey: this.testFriendKeys.find(v => v.username === "TEST1").friendkey });
        chai_1.expect(res.status).equal(400);
    }));
});
//# sourceMappingURL=user.test.js.map