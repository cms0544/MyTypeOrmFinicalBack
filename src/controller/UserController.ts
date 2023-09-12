import { AppDataSource } from '../data-source'
import { NextFunction, Request, Response } from "express"
import { TbUser } from "../entity/TbUser"
import { TbRole } from '../entity/TbRole';

import { TbUserRole } from '../entity/TbUserRole';
import { TbRoleRoute } from '../entity/TbRoleRoute';
import { convertJsonArrToArr } from '../utils/convetUtils';

const jwt = require("jsonwebtoken");
const bcryptjs = require("bcryptjs");

export class UserController {

    private userRepository = AppDataSource.getRepository(TbUser)
    private userRoleRepository = AppDataSource.getRepository(TbUserRole)
    private tbRoleRouteRepository = AppDataSource.getRepository(TbRoleRoute)

    async all(request: Request, response: Response, next: NextFunction) {
        return this.userRepository.find()
    }

    // async one(request: Request, response: Response, next: NextFunction) {
    //     const id = parseInt(request.params.id)


    //     const user = await this.userRepository.findOne({
    //         where: { id }
    //     })

    //     if (!user) {
    //         return "unregistered user"
    //     }
    //     return user
    // }

   /**
     * @swagger
     * /users/login:
     *    post: 
     *      tags: 
     *      - 用户
     *      summary: 登录用户 
     *      requestBody: 
     *          description: 登录用户
     *          content:
     *              application/json:
     *                  schema:
     *                      type: object
     *                      properties:
     *                           username:
     *                               type: string
     *                               description: 用户名
     *                           password:
     *                               type: string
     *                               description: 密码
     *      responses:
     *        200:
     *          description: successful operation 
     *          content:
     *              application/json:
     *                  schema:
     *                      type: object
     *                      properties:
     *                          success:
     *                              type: integer
     *                          msg:
     *                              type: string
     *                          token:
     *                              type: string
     *                          photourl:
     *                              type: string
     *                          roleid:
     *                              type: integer
     *        500:
     *          description:  internal error
     *        404:
     *          description:  not found                
     *  */ 
    async login(request:Request, response:Response,next:NextFunction){
        const {username,password} = request.body;
        const user = await this.userRepository.findOne({
            where:{username}
        });

        if(user == null ){
            return {success:0,message:"用户名不正确"};
        }else{
     
            if(!bcryptjs.compareSync( password,user.password)){
                return {success:0,message:"密码不正确"};
            }else{
                const token = jwt.sign({id:user.id},'token',{expiresIn:"30d"});
                return {success:1,user,token};
            }
        }
    }

    
    /**
     * @swagger
     * /users/register:
     *    post: 
     *      tags: 
     *      - 用户
     *      summary: 注册用户 
     *      requestBody: 
     *          description: 注册用户
     *          content:
     *              application/json:
     *                  schema:
     *                      type: object
     *                      properties:
     *                           username:
     *                               type: string
     *                               description: 用户名
     *                           password:
     *                               type: string
     *                               description: 密码
     *                           sex:
     *                               type: integer
     *                               description: 性别
     *                           photourl:
     *                               type: string
     *                               format: binary
     *                               description: 图片
     *                           city:
     *                               type: string
     *      responses:
     *        200:
     *          description: successful operation 
     *          content:
     *              application/json:
     *                  schema:
     *                      type: object
     *                      properties:
     *                          success:
     *                              type: integer
     *                          msg:
     *                              type: string
     *                          token:
     *                              type: string
     *                          photourl:
     *                              type: string
     *                          roleid:
     *                              type: integer
     *        500:
     *          description:  internal error
     *        404:
     *          description:  not found                
     *  */ 
    async register(request: Request, response: Response, next: NextFunction) {
        const { username, password, sex, photourl,city} = request.body;
        var user = await this.userRepository.findOne({where:{username}});

        if(user!=null){
            return {success:0,msg:"修改失败,"+username+"已存在"};
        }else{
            const password = bcryptjs.hashSync(request.body.password,10);

            user = Object.assign(new TbUser(), {
                username,
                password,
                sex,
                photourl,
                city
            })

            this.userRepository.save(user);
            return {success:1,user};
        }

        

     
    }

    /**
     * @swagger
     * /users/getinfo:
     *    post: 
     *      tags: 
     *      - 用户
     *      summary: 获取用户角色路由  
     *      security:
     *          - bearerAuth: []
     *      responses:
     *        200:
     *          description: successful operation 
     *          content:
     *              application/json:
     *                  schema:
     *                      type: object
     *                      properties:
     *                          success:
     *                              type: integer
     *                          res:
     *                              type: object
     *        500:
     *          description:  internal error
     *        404:
     *          description:  not found                
     *  */ 
    async getinfo(request: Request,response: Response,next: NextFunction) {
        try{
            const id = parseInt(request.params.id)
            console.log(request.id);
            let rolearr =await this.userRoleRepository.createQueryBuilder("tb_user_role")
            .leftJoinAndSelect("tb_user_role.role","tb_role")
            .select("tb_role.name","name")
            .where("tb_user_role.userid=:userid", {userid:request.id})
            .orderBy("tb_role.id","ASC")
            .getRawMany();
            
            let roles = convertJsonArrToArr(rolearr)
            
            const roleQb = await this.userRoleRepository.createQueryBuilder("tb_user_role")
            .where("tb_user_role.userid=:userid", {userid:request.id})
            .select("tb_user_role.roleid","roleid")
            

            let routearr = await this.tbRoleRouteRepository.createQueryBuilder("tb_role_route")
            .leftJoinAndSelect("tb_role_route.path","tb_path")
            .select("tb_path.*")
            
            .where("tb_role_route.roleid in ("+roleQb.getQuery()+")")
            .setParameters(roleQb.getParameters())
            .getRawMany();

            let routes = routearr
            
            return {
                success:1,
                res:{
                    roles,
                    routes
                }
            }
        }catch(ex){
            console.log(ex)
            return {
                success:0,
                err:ex
            }
        }
    }

    /**
     * @swagger
     * /users/logout:
     *    post: 
     *      tags: 
     *      - 注销
     *      summary: 注销  
     *      security:
     *          - bearerAuth: []
     *      responses:
     *        200:
     *          description: successful operation 
     *          content:
     *              application/json:
     *                  schema:
     *                      type: object
     *                      properties:
     *                          success:
     *                              type: integer
     *                          res:
     *                              type: object
     *        500:
     *          description:  internal error
     *        404:
     *          description:  not found                
     *  */ 
    async logout(request:Request, response: Response,next: NextFunction){
        return {
            success:1
        }
    }

    async remove(request: Request, response: Response, next: NextFunction) {
        const id = parseInt(request.params.id)

        let userToRemove = await this.userRepository.findOneBy({ id })

        if (!userToRemove) {
            return  {success:0,message:"this user not exist"}; 
        }

        await this.userRepository.remove(userToRemove)

        return  {success:1}; 
       
    }

}