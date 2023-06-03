import { AppDataSource } from '../data-source'
import { NextFunction, Request, Response } from "express"
import { Cost } from "../entity/Cost"
import { User } from '../entity/User'

export class CostController {

    private costRepository = AppDataSource.getRepository(Cost)
    private userRepository = AppDataSource.getRepository(User)
    
    /**
     * @swagger
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
        const {pricefrom,priceto,datefrom,dateto,key,costtype,userid} = request.body;
        var whereCondition = "1=1";
        
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

        if(costtype!=null && costtype!=""){
            whereCondition += " and cost.costtype = :costtype";
        }

        if(userid!=null && userid !=""){
            whereCondition +=" and cost.userid = :userid";
        }

      

        let res =await this.costRepository.createQueryBuilder("cost")
        .select("id,descript,price,DATE_FORMAT(date,'%Y-%m-%d %H:%i:%s') as date,costtype,userid")
        .where(whereCondition, whereObject)
        .getMany();
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
 *                           userid:
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
        const { descript, price, costtype,id } = request.body;
        var user:User = await this.userRepository.findOneBy({id:request.id});
       
        let cost:Cost = null;
        if(cost == null){
           cost =  Object.assign(new Cost(), {
                descript,
                price,
                costtype
                
            })
        } else{
            cost = await this.costRepository.findOneBy({id});
            if(id!=null){
                cost.descript = descript;
                cost.price = price;
                cost.costtype = costtype;
            }else{
                cost =  Object.assign(new Cost(), {
                    descript,
                    price,
                    costtype
                    
                })
            }
        
        }

        if(user.costs == null){
            user.costs = [cost];
        }else{
            user.costs.push(cost);
        }

        cost.user = user;

  
        await this.costRepository.save(cost);

        // await this.costRepository.save(user);

        return {success:1};
    }

    async remove(request: Request, response: Response, next: NextFunction) {
        const id = parseInt(request.params.id)

        let constToRemove = await this.costRepository.findOneBy({ id })

        if (!constToRemove) {
           return  {success:0,message:"this user not exist"} ;
        }

        await this.costRepository.remove(constToRemove)

        return {success:1}
    }

}