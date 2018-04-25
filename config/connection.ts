import * as mongoose from 'mongoose'

import {Environment} from './environments'

const {user, password, host, port, database} = Environment.mongo;

const path = `mongodb://${user}:${password}@${host}:${port}/${database}`;

mongoose.connection
    .once('error', err => console.log(`mongodb connect error:\n${err}`))
    .once('open', () => {
        Environment.identity !== 'test' && console.log('mongodb connect success')
    });

mongoose.connect(path)
    .then()
    .catch(err => console.log(err));