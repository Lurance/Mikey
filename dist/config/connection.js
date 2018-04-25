"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose = require("mongoose");
const environments_1 = require("./environments");
const { user, password, host, port, database } = environments_1.Environment.mongo;
const path = `mongodb://${user}:${password}@${host}:${port}/${database}`;
mongoose.connection
    .once('error', err => console.log(`mongodb connect error:\n${err}`))
    .once('open', () => {
    environments_1.Environment.identity !== 'test' && console.log('mongodb connect success');
});
mongoose.connect(path)
    .then()
    .catch(err => console.log(err));
//# sourceMappingURL=connection.js.map