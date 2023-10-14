import { DataSource } from "typeorm";

const dataSource = new DataSource({
    type: "mysql",
    host: process.env.DATABASE_HOST,
    port: Number(process.env.DATABASE_PORT),
    username: process.env.DATABASE_USERNAME,
    password: process.env.DATABASE_PWD,
    database: process.env.DATABASE_NAME,
    synchronize: Boolean(process.env.DATABASE_SYNCHRONIZE),
    logging: false,
    entities: [
        "src/**/*.entity.ts"
    ],
    subscribers: [],
    migrations: []
})

export const AppDataSource = dataSource