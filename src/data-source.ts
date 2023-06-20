import "reflect-metadata"
import { DataSource } from "typeorm"


export const AppDataSource = new DataSource({
    type: "mysql",
    host: process.env.SQLURL,
    port: parseInt(process.env.SQLPORT),
    username: process.env.SQLUSERNAME,
    password: process.env.SQLPASSWORD,
    database: "mycost",
    synchronize: false,
    logging: false,
    entities:[__dirname + "/entity/*.ts"],
    migrations: [],
    subscribers: [],
})
