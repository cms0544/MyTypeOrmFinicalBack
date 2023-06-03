import * as express from "express"
import * as bodyParser from "body-parser"
import { Request, Response } from "express"
import { AppDataSource } from "./data-source"
import { Routes } from "./routes"
var  vaildLogin = require("./utils/valid")

var swaggerInstall = require('./utils/swagger')


AppDataSource.initialize().then(async () => {

    // create express app
    const app = express()
    app.use(bodyParser.json())
    swaggerInstall(app);
    // register express routes from defined application routes
    Routes.forEach(route => {
        (app as any)[route.method](route.route,vaildLogin, (req: Request, res: Response, next: Function) => {
            const result = (new (route.controller as any))[route.action](req, res, next)
            if (result instanceof Promise) {
                result.then(result => result !== null && result !== undefined ? res.send(result) : undefined)

            } else if (result !== null && result !== undefined) {
                res.json(result)
            }
        })
    })

    // setup express app here
    // ...

    // start express server
    app.listen(9999)

    // // insert new users for test
    // await AppDataSource.manager.save(
    //     AppDataSource.manager.create(User, {
    //         username:"test",
    //         password:"test",
    //         sex:1
    //     })
    // )

    // await AppDataSource.manager.save(
    //     AppDataSource.manager.create(User, {
    //         firstName: "Phantom",
    //         lastName: "Assassin",
    //         age: 24
    //     })
    // )

   

}).catch(error => console.log(error))
