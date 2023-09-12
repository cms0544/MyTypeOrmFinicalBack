import { CostController } from "./controller/CostController"
import { UploadController } from "./controller/UploadController"
import { UserController } from "./controller/UserController"
import { CurrentPriceController } from "./controller/CurrentPriceController"
import { PathController } from "./controller/PathController"
import { RoleController } from "./controller/RoleController"

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
    method:"post",
    route: "/users/getinfo",
    controller: UserController,
    action: "getinfo"
    
},{
    method:"post",
    route: "/users/logout",
    controller: UserController,
    action: "logout"
    
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
    method:"get",
    route: "/costs/getsum",
    controller: CostController,
    action: "getSum"
},
{
    method:"get",
    route: "/costs/getSumByMonth",
    controller: CostController,
    action: "getSumByMonth"
    
},{
    method:"post",
    route: "/upload",
    controller: UploadController,
    action: "upload"
},{
    method:"post",
    route: "/curentprice/insertCurrentPrice",
    controller: CurrentPriceController,
    action: "insertCurrentPrice"
},{
    method:"get",
    route: "/curentprice/getTopOneCurrentPrice",
    controller: CurrentPriceController,
    action: "getTopOneCurrentPrice"
    
},{
    method:"post",
    route: "/path/queryAll",
    controller: PathController,
    action: "queryAll"
    
},{
    method:"put",
    route: "/path/addPath",
    controller: PathController,
    action: "add" 
},{
    method:"delete",
    route: "/path/removePath",
    controller:PathController,
    action:"delete"
},{
    method:"get",
    route: "/role/getRole",
    controller:RoleController,
    action:"getRole"
}]