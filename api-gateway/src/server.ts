import * as dotenv from "dotenv"
import { resolve } from "path"

const path = resolve(__dirname, `../.${process.env.NODE_ENV}.env`)
dotenv.config({path: path})

import helmet from "helmet"
import express from "express"
import { AppDataSource } from "./config/typeORM.config"
import { ServiceShared } from "./common/shared/service.shared"
import { configDynamicRouter } from "./routes/config-routes-dynamic/config-routes-dynamic.controller"


(async () => {
    const port = 8080
    const app = express()
    const serviceShared = new ServiceShared()

    // * Config express
    app.use(helmet())
    app.use(express.json())
    app.disable('x-powered-by');
    

    // * Database
    const dataSource = await AppDataSource.initialize()
    serviceShared.consoleLogColor(`\x1b[33m[Database]\x1b[0m \x1b[32mDatabase is initialize: ${dataSource.isInitialized}\x1b[0m`)

    // * Routes
    app.use("/dynamic", require("../src/routes/gateway/gateway.controller"))
    app.use("/dynamic-config", configDynamicRouter)

    // * Server
    app.listen(port, () => {
        serviceShared.consoleLogColor(`\x1b[33m[ExpressApplication]\x1b[0m \x1b[32mExpress Application successfully stated in url http://localhost:${port}/\x1b[0m`)
    })
})()