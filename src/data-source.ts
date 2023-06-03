import "reflect-metadata"
import { DataSource } from "typeorm"
import { Cost } from "./entity/Cost"
import { User } from "./entity/User"

export const AppDataSource = new DataSource({
    type: "mysql",
    host: "175.178.243.25",
    port: 3306,
    username: "root",
    password: "admincmms",
    database: "mycost",
    synchronize: false,
    logging: false,
    entities:[__dirname + "/entity/*.ts"],
    migrations: [],
    subscribers: [],
})
