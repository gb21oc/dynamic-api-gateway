import * as dotenv from "dotenv"
import { resolve } from "path"

const path = resolve(__dirname, `../.${process.env.NODE_ENV}.env`)
dotenv.config({path: path})

import express from "express"
import { AppDataSource } from "./config/typeORM.config"

(async () => {
    const port = 8080
    const app = express()

    // * Database
    const dataSource = await AppDataSource.initialize()
    console.log(`[+] Database is initialize: ${dataSource.isInitialized}`)

    app.use(express.json())
    //app.use("/dynamic", require("../src/routes/gateway/gateway.route"))
    //app.use("/dynamic-config", configGateway)
    app.listen(port, () => {
        console.log(`[+] App listering on port ${port}`)
    })
})()