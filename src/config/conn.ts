import * as mongoose from "mongoose"

import {Environment} from "./environments"

switch (Environment.identity) {
    case 'development':
        mongoose.connect(`mongodb://${Environment.dbHost}:${Environment.dbPort}/${Environment.dbName}`)
            .then()
            .catch(err => console.log(err))
        break
    case 'production':
        // 此处防止生产环境下的MongoDB相关连接配置
        mongoose.connect(`mongodb://${Environment.dbHost}:${Environment.dbPort}/${Environment.dbName}`)
            .then()
            .catch(err => console.log(err))
        break
}


mongoose.connection
    .once('error', err => console.error(`mongodb connect error:\n${err}`))
    .once('open', () => {
        Environment.identity !== 'test' && console.log('mongodb connect success')
    });

export {
    mongoose
}