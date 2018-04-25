import {createServer} from "./config/application";

import {Environment} from "./config/environments";

module.exports = (async () => {
    try {
        const app = await createServer();
        return app.listen(Environment.port, () => {
            console.log(`Server listening on ${Environment.port}, in ${Environment.identity} mode.`)
        })
    } catch (e) {
        console.log(e);
        process.exit(1)
    }
})();