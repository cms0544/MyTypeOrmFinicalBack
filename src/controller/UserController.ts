import { AppDataSource } from '../data-source'
import { NextFunction, Request, Response } from "express"
import { User } from "../entity/User"
const jwt = require("jsonwebtoken");
const bcryptjs = require("bcryptjs");

export class UserController {

    private userRepository = AppDataSource.getRepository(User)

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

            user = Object.assign(new User(), {
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