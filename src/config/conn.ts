import * as mongoose from "mongoose"

import {Environment} from "./environments"

switch (Environment.identity) {
    case 'development':
        mongoose.connect(`mongodb://${Environment.dbHost}:${Environment.dbPort}/${Environment.dbName}`)
            .then()
            .catch(err => console.log(err))
}

mongoose.connection
    .once('error', err => console.error(`mongodb connect error:\n${err}`))
    .once('open', () => {
        Environment.identity !== 'test' && console.log('mongodb connect success')
    });

export {
    mongoose
}