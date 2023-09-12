import * as dotenv from 'dotenv' 
dotenv.config({path:`.env.${process.env.NODE_ENV}`})

import "reflect-metadata"
import { DataSource } from "typeorm"
import { TbUser } from "./entity/TbUser"
import { TbCost } from "./entity/TbCost"
import { TbCurrentprice } from "./entity/TbCurrentprice"
import { TbPath } from "./entity/TbPath"
import { TbRole } from "./entity/TbRole"
import { TbRoleRoute } from "./entity/TbRoleRoute"
import { TbCityinfo } from "./entity/TbCityinfo"
import { TbUserRole } from "./entity/TbUserRole"



export const AppDataSource = new DataSource({
    type: "mysql",
    host: process.env.SQLURL,
    port: parseInt(process.env.SQLPORT),
    username:process.env.SQLUSERNAME,
    password: process.env.SQLPASSWORD,
    database: "mycost",
    synchronize: false,
    logging: false,
    entities:[TbUser,TbCost,TbCurrentprice,TbPath,TbRole,TbRoleRoute,TbCityinfo,TbUserRole],
    migrations: [],
    subscribers: [],
})
