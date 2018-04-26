import Timer = NodeJS.Timer

process.env.NODE_ENV = 'test';

import * as server from '../app'

import * as chai from 'chai'

import chaiHttp = require("chai-http");


chai.use(chaiHttp)

let timer: Timer;

const closeServer = () => {
    timer && clearTimeout(timer);
    timer = setTimeout(() => {
        process.exit(0);
        clearTimeout(timer)
    }, 2000)
};

export const app = async(): Promise<ChaiHttp.Agent> => {
    closeServer();
    return chai.request(await server)
};
