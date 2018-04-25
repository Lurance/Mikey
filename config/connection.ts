import * as mongoose from 'mongoose'

import {Environment} from './environments'

const {user, password, host, port, database, nopass} = Environment.mongo;

const path = nopass ? `mongodb://${host}:${port}/${database}` : `mongodb://${user}:${password}@${host}:${port}/${database}`;

mongoose.connection
    .once('error', err => console.error(`mongodb connect error:\n${err}`))
    .once('open', () => {
        Environment.identity !== 'test' && console.log('mongodb connect success')
    });

mongoose.connect(path)
    .then()
    .catch(err => console.log(err));

export {
    mongoose
}