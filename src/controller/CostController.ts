import { AppDataSource } from '../data-source'
import { NextFunction, Request, Response } from "express"
import { TbCost } from "../entity/TbCost"
import { TbUser } from '../entity/TbUser'
import { TbCurrentprice } from '../entity/TbCurrentprice'

export class CostController {

    private costRepository = AppDataSource.getRepository(TbCost)
    private userRepository = AppDataSource.getRepository(TbUser)
    private currentPriceRepository = AppDataSource.getRepository(TbCurrentprice);
    /**
     * @swagger
     * components:
     *      securitySchemes:
     *          bearerAuth:            # arbitrary name for the security scheme
     *              type: http
     *              scheme: bearer
     *              bearerFormat: JWT
     * /costs: #一定要写完整路径 我使用路由中间件的时候 加了api前缀
     *    get:
     *      tags: #支出收入
     *      - 支出
     *      summary: 获取支出收入  #这个接口的提示
     *      security:
     *          - bearerAuth: []
     *      parameters: #参数以及参数类型
     *           - in: query
     *             name: lastUpdateTime
     *             schema:
     *                type: string
     *                format: date-time
     *           - in: query
     *             name: searchtxt
     *             schema:
     *                type: string
     *           - in: query
     *             name: costtype
     *             schema:
     *                type: integer
     *           - in: query
     *             name: page
     *             schema:
     *                type: integer
     *           - in: query
     *             name: limit
     *             schema:
     *                type: integer
     *           - in: query
     *             name: sort
     *             schema:
     *                type: string
     *           - in: query
     *             name: sortingRules
     *             schema:
     *                type: string
     *      responses:
     *        200:
     *          description: successful operation 
     *        500:
     *          description:  internal error
     *        404:
     *          description:  not found        
     *   
     * */
    async all(request: Request, response: Response, next: NextFunction) {
        const {pricefrom,priceto,datefrom,dateto,key,costtype} = request.query;
        var whereCondition = "1=1";
        const userid = request.id;
        var whereObject = {pricefrom,priceto,datefrom,dateto,key:"%"+key+"%",costtype,userid};
        if(pricefrom !="" && pricefrom !=null){
            whereCondition += " and cost.price >= :pricefrom";
        }

        if(priceto !="" && priceto !=null){
            whereCondition += " and cost.price <= :priceto";
        }

        if(datefrom!=null && datefrom!=""){
            whereCondition += " and cost.date >= :datefrom";
        }

        if(dateto!=null && dateto!=""){
            whereCondition += " and cost.date <= :dateto";
        }

        if(key!=null && key!=""){
            whereCondition += " and cost.descript like :key";
        }

        if(costtype!=null && costtype!="" && costtype !="-1"){
            whereCondition += " and cost.costtype = :costtype";
        }

        if(userid!=null && userid !=""){
            whereCondition +=" and cost.userid = :userid";
        }


        let res =await this.costRepository.createQueryBuilder("cost")
        .select(["cost.id as id","cost.descript as descript","cost.price as price","cost.costtype as costtype"])
        .addSelect("DATE_FORMAT(cost.date,'%Y-%m-%d')","date")
        .where(whereCondition, whereObject)
        .orderBy("date","DESC")
        .getRawMany();
        return {success:1,res}
    }


    
/**
 * @swagger
 * /costs/insertCost: #一定要写完整路径 我使用路由中间件的时候 加了api前缀
 *    post:
 *       tags: 
 *       - 支出
 *       summary: 插入财务数据  #这个接口的提示
 *       security:
 *          - bearerAuth: []
 *       requestBody: 
 *          description: 插入财务数据
 *          content:
 *              application/json:
 *                  schema:
 *                      type: object
 *                      properties:
 *                           descript:
 *                               type: string
 *                               description: 描述
 *                           price:
 *                               type: string
 *                               description: 价格
 *                           date:
 *                               type: string
 *                               description: 日期
 *                               format: date-time
 *                           costtype:
 *                               type: string
 *                               description: 支出类型
 *                           id:
 *                               type: integer
 *                               description: id
 *       responses:
 *          200:
 *              description: successful operation 
 *          500:
 *              description:  internal error
 *          404:
 *              description:  not found        
 *   
 * */
    async insertCost(request: Request, response: Response, next: NextFunction) {
        try{
            const { descript, price, costtype,id ,date} = request.body;
            var user:TbUser = await this.userRepository.findOneBy({id:request.id});
           
            let cost:TbCost = await this.costRepository.findOneBy({id});
            if(cost == null){
               cost =  Object.assign(new TbCost(), {
                    descript,
                    price,
                    costtype,
                    date
                    
                })

            } else{
    
                
                if(id!=null){
                    cost.descript = descript;
                    cost.price = price;
                    cost.costtype = costtype;
                    cost.date = date;
                }else{
                    cost =  Object.assign(new TbCost(), {
                        descript,
                        price,
                        costtype,
                        date
                        
                    })
                }
            
            }
    
            if(user.tbCosts == null){
                user.tbCosts = [cost];
            }else{
                user.tbCosts.push(cost);
            }
    
            cost.user = user;
    
      
            await this.costRepository.save(cost);
    
            // await this.costRepository.save(user);
    
            return {success:1};
        }catch(e){
            console.log(e)
            return {success:0,message:e};
        }
      
    }

    
/**
 * @swagger
 * /costs/remove: #一定要写完整路径 我使用路由中间件的时候 加了api前缀
 *   delete:
 *       tags: 
 *       - 支出
 *       summary: 删除财务数据  #这个接口的提示
 *       security:
 *          - bearerAuth: []
 *       parameters: #参数以及参数类型
 *           - in: query
 *             name: lastUpdateTime
 *             schema:
 *                type: string
 *       responses:
 *          200:
 *              description: successful operation 
 *          500:
 *              description:  internal error
 *          404:
 *              description:  not found        
 *   
 * */
    async remove(request: Request, response: Response, next: NextFunction) {
        const id = parseInt(request.params.id)

        let constToRemove = await this.costRepository.findOneBy({ id })

        if (!constToRemove) {
           return  {success:0,message:"this user not exist"} ;
        }

        await this.costRepository.remove(constToRemove)

        return {success:1}
    }

/**
 * @swagger
 * /costs/getSum: #一定要写完整路径 我使用路由中间件的时候 加了api前缀
 *   get:
 *       tags: 
 *       - 支出
 *       summary: 获取总收入  #这个接口的提示
 *       security:
 *          - bearerAuth: []
 *       parameters: #参数以及参数类型
 *           - in: query
 *             name: lastUpdateTime
 *             schema:
 *                type: string
 *                format: date-time
 *           - in: query
 *             name: searchtxt
 *             schema:
 *                type: string
 *           - in: query
 *             name: costtype
 *             schema:
 *                type: integer
 *           - in: query
 *             name: page
 *             schema:
 *                type: integer
 *           - in: query
 *             name: limit
 *             schema:
 *                type: integer
 *           - in: query
 *             name: sort
 *             schema:
 *                type: string
 *           - in: query
 *             name: sortingRules
 *             schema:
 *                type: string
 *       responses:
 *          200:
 *              description: successful operation 
 *          500:
 *              description:  internal error
 *          404:
 *              description:  not found        
 *   
 * */
    async getSum(request: Request, response: Response, next: NextFunction): Promise<{ success: number; sum: number; message?: undefined } | { success: number; message: any; sum?: undefined }>{
       try{
        const {pricefrom,priceto,datefrom,dateto,key,costtype} = request.query;
        let whereCondition = "1=1"
        let whereObject = {pricefrom,priceto,datefrom,dateto,key:"%"+key+"%",costtype,userid: request.id };
        if(pricefrom !="" && pricefrom !=null){
            whereCondition += " and cost.price >= :pricefrom";
        }

        if(priceto !="" && priceto !=null){
            whereCondition += " and cost.price <= :priceto";
        }

        if(datefrom!=null && datefrom!=""){
            whereCondition += " and cost.date >= :datefrom";
        }

        if(dateto!=null && dateto!=""){
            whereCondition += " and cost.date <= :dateto";
        }

        if(key!=null && key!=""){
            whereCondition += " and cost.descript like :key";
        }

        if(costtype!=null && costtype!="" && costtype !="-1"){
            whereCondition += " and cost.costtype = :costtype";
        }

        if(request.id!=null && request.id !=""){
            whereCondition +=" and cost.userid = :userid";
        }

        let { sum } = await this.costRepository
        .createQueryBuilder("cost")
        .select("sum(if(costtype = 1,-price,price))", "sum")
        .where(whereCondition,whereObject)
        .getRawOne();

        if(sum == null){
            sum = 0;
        }

        // const { maxid } = await this.currentPriceRepository
        // .createQueryBuilder("currentPriceRepository")
        // .select("max(id)", "maxid")
        // .where("currentPriceRepository.userid = :id", { id: request.id })
        // .getRawOne();

  
        // let currentPrice = 0;
        // if(maxid != null){
        //      currentPrice  = (await this.currentPriceRepository
        //     .createQueryBuilder("currentPriceRepository")
        //     .select("currentPrice", "currentPrice")
        //     .where("currentPriceRepository.userid = :userid and currentPriceRepository.id= :id", { userid: request.id,id:maxid })
        //     .getRawOne()).currentPrice;
            
        // }

       const total:number =  parseFloat(sum) 

        return {success:1,sum:total}
       }catch(e){
        return {success:0,message:e}
       }
       
    } 

/**
 * @swagger
 * /costs/getSumByMonth: #一定要写完整路径 我使用路由中间件的时候 加了api前缀
 *   get:
 *       tags: 
 *       - 支出
 *       summary: 获取每月支出  #这个接口的提示
 *       security:
 *          - bearerAuth: []
 *       parameters: #参数以及参数类型
 *           - in: query
 *             name: datefrom
 *             schema:
 *                type: string
 *                format: date-time
 *           - in: query
 *             name: dateto
 *             schema:
 *                type: string
 *       responses:
 *          200:
 *              description: successful operation 
 *          500:
 *              description:  internal error
 *          404:
 *              description:  not found        
 *   
 * */
    async getSumByMonth(request: Request, response: Response, next: NextFunction){
        try{
            const { datefrom,dateto} = request.query;
            const whereObject = {userid:request.id,datefrom,dateto};
            let whereCondition = " cost.userid = :userid ";
            if(datefrom!=null){
                whereCondition += " and cost.date >=:datefrom ";
            }

            if(dateto!=null){
                whereCondition += " and cost.date <=:dateto ";
            }

            let res = await this.costRepository.createQueryBuilder("cost")
            .select("sum(if(costtype=1,-price,price))","y")
            .addSelect("DATE_FORMAT(cost.date,'%Y-%m')","name")
            .where(whereCondition,whereObject)
            .groupBy("DATE_FORMAT(cost.date,'%Y-%m')")
            .getRawMany();

            
            return {success:1,res}

        }catch(e){
            return {success:0,message:e}
        }
    }

}