import {app} from "../base";

import {expect} from 'chai'

import {verify} from "jsonwebtoken";

import {Environment} from "../../config/environments";

import {User} from "../../app/models";

import {UserService} from "../../app/services";

describe('UserModule 鉴权 APIS测试  ', () => {
    before(async () => {
        if (await User.findOne({username: Environment.defaultUsername})) return;
        await new User({
            username: Environment.defaultUsername,
            password: Environment.defaultPassword,
            usertype: 1
        }).save();
    });

    after(async () => {
        await User.remove({username: Environment.defaultUsername})
    });

    beforeEach(async () => {
        this.server = await app();
    });

    it('AUTH FOR ADMINISTRATOR BY DEFAULT USERNAME&PASSWORD', async (): Promise<void> => {
        const res: ChaiHttp.Response = await this.server.post('/api/v1/admin/login')
            .send({username: Environment.defaultUsername, password: Environment.defaultPassword});
        expect(res.status).equal(200);
        expect(res.body).to.have.property('jwt');

        const payload: any = verify(res.body.jwt.token, Environment.jwtsecret);
        expect(payload.username).equal('admin');
        expect(payload.usertype).equal(1);
    });

    it('AUTH FOR ADMINISTRATOR BY WRONG SERNAME&PASSWORD', async (): Promise<void> => {
        const res: ChaiHttp.Response = await this.server.post('/api/v1/admin/login')
            .send({username: 'vnwoen 423 啊啊啊 哈哈 ！#', password: '  3423cckwergpo4jr∫∆ˆˆ≈˚©∫'});
        expect(res.status).equal(401)
    });

    it('AUTH FOR CUSTOMER BY WRONG CODE', async (): Promise<void> => {
        const res: ChaiHttp.Response = await this.server.post('/api/v1/login')
            .send({code: 'cv;qwefkop4opf  的\''});
        expect(res.status).equal(401)
    });
});


describe('UserModule 好友 APIS测试', () => {
    before(async () => {
        this.testFriendKeys = [];
        const u1 = await new User({
            username: 'TEST1',
            usertype: 2,
        }).save();

        this.testFriendKeys.push({
            username: u1.username,
            friendkey: u1.friendkey,
            jwt: UserService.genJWToken(u1),
            _id: u1._id
        });

        const u2 = await new User({
            username: 'TEST2',
            usertype: 2,
        }).save();

        this.testFriendKeys.push({
            username: u2.username,
            friendkey: u2.friendkey,
            jwt: UserService.genJWToken(u2),
            _id: u2._id
        });

        const u3 = await new User({
            username: 'TEST3',
            usertype: 2,
        }).save();

        this.testFriendKeys.push({
            username: u3.username,
            friendkey: u3.friendkey,
            jwt: UserService.genJWToken(u3),
            _id: u3._id
        })
    });

    after(async () => {
        await User.remove({username: {$in: ["TEST1", "TEST2", "TEST3"]}})
    });

    beforeEach(async () => {
        this.server = await app();
    });

    it('ADD FRIEND TEST1 FRIEND WITH 2', async (): Promise<void> => {
        const res: ChaiHttp.Response = await this.server.post('/api/v1/user/friend')
            .set('Authorization', `Bearer ${this.testFriendKeys.find(v => v.username === 'TEST1').jwt.token}`)
            .send({friendkey: this.testFriendKeys.find(v => v.username === "TEST2").friendkey})
        expect(res.status).equal(200);
        expect(res.body.username).equal('TEST2');
        expect(res.body._id).equal(String(this.testFriendKeys.find(v => v.username === 'TEST2')._id));
    });

    it('ADD FRIEND TEST1 FRIEND WITH 3', async (): Promise<void> => {
        const res: ChaiHttp.Response = await this.server.post('/api/v1/user/friend')
            .set('Authorization', `Bearer ${this.testFriendKeys.find(v => v.username === 'TEST1').jwt.token}`)
            .send({friendkey: this.testFriendKeys.find(v => v.username === "TEST3").friendkey});
        expect(res.status).equal(200);
        expect(res.body.username).equal('TEST3');
        expect(res.body._id).equal(String(this.testFriendKeys.find(v => v.username === 'TEST3')._id));
    });

    it('ADD FRIEND TEST1 FRIEND WITH 2 ANAIN', async (): Promise<void> => {
        const res: ChaiHttp.Response = await this.server.post('/api/v1/user/friend')
            .set('Authorization', `Bearer ${this.testFriendKeys.find(v => v.username === 'TEST1').jwt.token}`)
            .send({friendkey: this.testFriendKeys.find(v => v.username === "TEST2").friendkey});
        expect(res.status).equal(400);
    });

    it('ADD FRIEND TEST2 FRIEND WITH 1', async (): Promise<void> => {
        const res: ChaiHttp.Response = await this.server.post('/api/v1/user/friend')
            .set('Authorization', `Bearer ${this.testFriendKeys.find(v => v.username === 'TEST2').jwt.token}`)
            .send({friendkey: this.testFriendKeys.find(v => v.username === "TEST1").friendkey});
        expect(res.status).equal(400);
    });
});