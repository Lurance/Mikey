"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose = require("mongoose");
exports.mongoose = mongoose;
const environments_1 = require("./environments");
switch (environments_1.Environment.identity) {
    case 'development':
        mongoose.connect(`mongodb://${environments_1.Environment.dbHost}:${environments_1.Environment.dbPort}/${environments_1.Environment.dbName}`)
            .then()
            .catch(err => console.log(err));
        break;
    case 'production':
        mongoose.connect(`mongodb://${environments_1.Environment.dbHost}:${environments_1.Environment.dbPort}/${environments_1.Environment.dbName}`)
            .then()
            .catch(err => console.log(err));
        break;
}
mongoose.connection
    .once('error', err => console.error(`mongodb connect error:\n${err}`))
    .once('open', () => {
    environments_1.Environment.identity !== 'test' && console.log('mongodb connect success');
});
//# sourceMappingURL=conn.js.map