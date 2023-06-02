import "reflect-metadata"
import { DataSource } from "typeorm"
import { Cost } from "./entity/Cost"
// import { User } from "./entity/User"

export const AppDataSource = new DataSource({
    type: "mysql",
    host: "localhost",
    port: 3306,
    username: "root",
    password: "root",
    database: "myfinancedb",
    synchronize: true,
    logging: false,
    entities: [Cost],
    migrations: [],
    subscribers: [],
})
