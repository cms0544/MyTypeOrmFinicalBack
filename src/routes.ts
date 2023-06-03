import { CostController } from "./controller/CostController"
import { UploadController } from "./controller/UploadController"
import { UserController } from "./controller/UserController"

export const Routes = [
{
    method: "post",
    route: "/users/login",
    controller: UserController,
    action: "login"
},
{
    method: "post",
    route: "/users/register",
    controller: UserController,
    action: "register"
}, {
    method: "delete",
    route: "/users/:id",
    controller: UserController,
    action: "remove"
},{
    method:"get",
    route: "/costs",
    controller: CostController,
    action: "all"
},{
    method:"post",
    route: "/costs/insertCost",
    controller: CostController,
    action: "insertCost"
},{
    method:"delete",
    route: "/costs/remove/:id",
    controller: CostController,
    action: "remove"
},{
    method:"post",
    route: "/upload",
    controller: UploadController,
    action: "upload"
}]