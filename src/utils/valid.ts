
const jwt = require('jsonwebtoken');
const redisClient = require('../utils/redisUtils')

const vaildLogin = async (req,res,next)=>{    //验证token登录

    try{
        await redisClient.connect();
  
        
        let blacklist =await redisClient.hVals('blacklist');
    
        if(blacklist == null){
            blacklist = []
        }
        let token = req.headers.authorization.split(" ").pop();

        if(req.url.indexOf("/logout")==-1){
            if(blacklist.indexOf(token)!=-1){
                //在黑名单不给登录
                throw "token error";
            }
            req.id = jwt.verify(token,'token').id;
        }else{
            if(blacklist.indexOf(token)==-1){
                await redisClient.hSet("blacklist",blacklist.length,token,{
                    EX: 10,
                    NX: true
                  })
                
            }
        }
      
        next();
    }catch(e){
        console.log(e)
        if((req.url.indexOf( "/register")!=-1 || req.url.indexOf("/login")!=-1) && (req.body.id == null || req.body.id ==0 )){
            //注册可以不用token
            next();
        }else{
            res.status(401).send("token error");
        }
       
    }finally{
        await redisClient.disconnect();
    }
  
}

module.exports = vaildLogin;