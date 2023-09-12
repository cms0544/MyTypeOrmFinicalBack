import { AppDataSource } from '../data-source'
import { NextFunction, Request, Response } from "express"
import { TbRole } from "../entity/TbRole"

export class RoleController{
    private roleRepository = AppDataSource.getRepository(TbRole);


      /**
     * @swagger
     * /role/getRole:
     *    get: 
     *      tags: 
     *      - 角色
     *      summary: 查询角色
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
     *                          msg:
     *                              type: string
     *                          data:
     *                              type: object
     *        500:
     *          description:  internal error
     *        404:
     *          description:  not found                
     *  */ 
    async getRole(request:Request,response:Response,next:NextFunction){
      let res= await this.roleRepository.find();
      return {success:1,data:res};
    } 
}