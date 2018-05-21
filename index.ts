import {createHttpServer} from "./src/app";

import {Environment} from "./src/config/environments"

module.exports = (async () => {
    try {
        const app = await createHttpServer()

        const server = app.listen(Environment.port, () => {
            console.log(`Server is listening on ${Environment.port}, in ${Environment.identity} mode!`)
        })
    } catch (e) {
        console.log(e)
        process.exit(1)
    }
})();