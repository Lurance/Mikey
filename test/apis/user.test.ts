import {app} from "../base";

import { expect } from 'chai'

import {verify} from "jsonwebtoken";

import {Environment} from "../../config/environments";

describe('TEST USER APIS', () => {
    beforeEach(async () => {
        this.server = await app();
    });

    it('AUTH FOR ADMINISTRATOR BY DEFAULT USERNAME&PASSWORD', async(): Promise<void> => {
        const res: ChaiHttp.Response = await this.server.post('/api/v1/admin/login')
            .send({username: Environment.defaultUsername, password: Environment.defaultPassword})
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

    it('AUTH FOR CUSTOMER BY WRONG CODE', async () => {
        const res: ChaiHttp.Response = await this.server.post('/api/v1/login')
            .send({code: 'cv;qwefkop4opf  的\''});
        expect(res.status).equal(401)
    })
})