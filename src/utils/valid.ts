
const jwt = require('jsonwebtoken');
const vaildLogin = (req,res,next)=>{    //验证token登录

    try{
       
        let token = req.headers.authorization.split(" ").pop();
      
        req.id = jwt.verify(token,'token').id;

        next();
    }catch(e){
   
        if((req.url.indexOf( "/register")!=-1 || req.url.indexOf("/login")!=-1) && (req.body.id == null || req.body.id ==0 )){
            //注册可以不用token
            next();
        }else{
            res.status(401).send("token error");
        }
       
    }
  
}

module.exports = vaildLogin;