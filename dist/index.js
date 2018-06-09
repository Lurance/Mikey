"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = require("./src/app");
const environments_1 = require("./src/config/environments");
module.exports = (async () => {
    try {
        const app = await app_1.createHttpServer();
        const server = app.listen(environments_1.Environment.port, () => {
            console.log(`Server is listening on ${environments_1.Environment.port}, in ${environments_1.Environment.identity} mode!`);
        });
    }
    catch (e) {
        console.log(e);
        process.exit(1);
    }
})();
//# sourceMappingURL=index.js.map