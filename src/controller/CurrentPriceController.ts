import { AppDataSource } from '../data-source'
import { NextFunction, Request, Response } from "express"

import { TbCurrentprice } from '../entity/TbCurrentprice'
import { TbUser } from '../entity/TbUser';


export class CurrentPriceController {

    private currentPriceRepository = AppDataSource.getRepository(TbCurrentprice);
    private userRepository = AppDataSource.getRepository(TbUser);
    

/**
 * @swagger
 * /curentprice/insertCurrentPrice: #一定要写完整路径 我使用路由中间件的时候 加了api前缀
 *    post:
 *       tags: 
 *       - 支出
 *       summary: 插入当前余额 #这个接口的提示
 *       security:
 *          - bearerAuth: []
 *       requestBody: 
 *          description: 插入当前余额
 *          content:
 *              application/json:
 *                  schema:
 *                      type: object
 *                      properties:
 *                           cuurentprice:
 *                               type: number
 *                               description: 当前价格
 *       responses:
 *          200:
 *              description: successful operation 
 *          500:
 *              description:  internal error
 *          404:
 *              description:  not found        
 *   
 * */
     async insertCurrentPrice(request: Request, response: Response, next: NextFunction) {
        try{
            const { currentprice,insertdate} = request.body;
            let user = await this.userRepository.findOneBy({id:request.id});
           

           let tbCuurentPrice:TbCurrentprice= new TbCurrentprice();
           tbCuurentPrice.currentPrice = currentprice;
           tbCuurentPrice.insertdate = insertdate;
            if(user!=null){
                if(user.tbCurrentprices == null){
                    user.tbCurrentprices = [tbCuurentPrice];
                }else{
                    user.tbCurrentprices.push(tbCuurentPrice);
                }
            }else{
                return {success:0,message:"user is null"}
            }

            tbCuurentPrice.user = user;
           
    

             await this.currentPriceRepository.save(tbCuurentPrice);
    
            return {success:1};
        }catch(e){
            return {success:0,message:e};
        }
      
    }


/**
 * @swagger
 * /curentprice/getTopOneCurrentPrice: #一定要写完整路径 我使用路由中间件的时候 加了api前缀
 *    get:
 *       tags: 
 *       - 支出
 *       summary: 获取最新余额 #这个接口的提示
 *       security:
 *          - bearerAuth: []
 *       requestBody: 
 *          description: 获取最新余额
 *       responses:
 *          200:
 *              description: successful operation 
 *          500:
 *              description:  internal error
 *          404:
 *              description:  not found        
 *   
 * */
   async getTopOneCurrentPrice(request: Request, response: Response, next: NextFunction){
        try{
         
            let res =await this.currentPriceRepository.createQueryBuilder("currentprice")
            .select("currentprice.currentPrice","currentprice")
            .addSelect("DATE_FORMAT(currentprice.insertdate,'%Y-%m-%d')","insertdate")
            .where("userid=:userid", {userid:request.id})
            .orderBy("id","DESC")
            .getRawOne();
         
            return {success:1,res};
        }catch(e){
            return {success:0,message:e};
        }
   }


}