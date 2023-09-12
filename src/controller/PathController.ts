import { AppDataSource } from '../data-source'
import { NextFunction, Request, Response } from "express"
import { TbPath } from '../entity/TbPath';
import { In, Like } from 'typeorm';


export class PathController {

    private tbpathRepository = AppDataSource.getRepository(TbPath)

    /**
     * @swagger
     * /path/queryAll:
     *    post: 
     *      tags: 
     *      - 菜单
     *      summary: 查询菜单 
     *      security:
     *          - bearerAuth: []
     *      requestBody: 
     *          description: 查询菜单
     *          content:
     *              application/json:
     *                  schema:
     *                      type: object
     *                      properties:
     *                          querytext:
     *                               type: string
     *                               description: 关键字
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
    async queryAll(request: Request, response: Response, next: NextFunction) {
        try{
            var { querytext } = request.body;

            let data =await this.tbpathRepository.find({
                where:[
                    { name : Like('%'+querytext+'%') },
                    { title : Like('%'+querytext+'%')}
    
                ]
            })


    
            return {
                success:1,
                data
            }
        }catch(ex){
            return {
                success:0,
                message:ex
                
            }
        }
        
    }


 /**
 * @swagger
 * /path/addPath:
 *    put: 
 *      tags: 
 *      - 菜单
 *      summary: 新增菜单 
 *      security:
 *          - bearerAuth: []
 *      requestBody: 
 *          description: 新增菜单
 *          content:
 *              application/json:
 *                  schema:
 *                      type: object
 *                      properties:
 *                          id:
 *                                type: integer
 *                                description: 主键id
 *                          path:
 *                                type: string
 *                                description: 路径
 *                          name:
 *                                type: string
 *                                description: 别名
 *                          title:
 *                                type: string
 *                                description: 菜单名  
 *                          icon:
 *                                type: string
 *                                description: 图标  
 *                          componenturl:
 *                                type: string
 *                                description: 组件路径  
 *                          noCache:
 *                                type: integer
 *                                description: 没缓存  
 *                          fatherid:
 *                                type: integer
 *                                description: 父节点  
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
    async add(request: Request, response: Response, next: NextFunction){
        try{
            
            const tbpath = new TbPath();
            await this.tbpathRepository.merge(tbpath,request.body);
         
             this.tbpathRepository.save(tbpath)
            return {
                success:1,
                mesg:"success"
            }
        }catch(ex){
            return {
                success:0,
                msg:ex
            }
        }
    }


 /**
 * @swagger
 * /path/removePath:
 *    delete: 
 *      tags: 
 *      - 菜单
 *      summary: 删除菜单 
 *      security:
 *          - bearerAuth: []
 *      requestBody: 
 *          description: 删除菜单
 *          content:
 *              application/json:
 *                  schema:
 *                      type: object
 *                      properties:
 *                          ids:
 *                                type: array
 *                                description: 主键id 
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
    async delete(request:Request,response:Response,next:NextFunction){
        try{
            const tbpaths =await this.tbpathRepository.find({where:{id: In(request.body.ids)}})
            this.tbpathRepository.remove(tbpaths)
            return {
                success:1,
                msg:''
            }

        }catch(ex){
            return {
                success:0,
                msg:ex
            }
        }
    }
  
   
   

}