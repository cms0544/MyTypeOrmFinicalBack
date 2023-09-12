import { NextFunction, Request, Response } from "express"

var multer = require("multer")
var fs = require("fs")
const path = require("path");


const Storage = multer.diskStorage({
   
    destination:async function(req,res,cb){
   
        let isexists =await fs.existsSync("img");
        if(!isexists){
            await fs.mkdirSync("img");

        }
        cb(null,"img");
    },
    filename:function(req,file,cb){
        cb(null,path.parse(file.originalname).name+Date.now()+path.extname(file.originalname));

    }
})

const filterFilter = (req,file,cb)=>{
    if(file.mimetype == "image/png" || file.mimetype == "image/jpg" || file.mimetype == "image/jpeg"){
        cb(null,true);
    }else{
        cb(null,false);
    }
}

const upload = multer({ storage:Storage,fileFilter:filterFilter })

export class UploadController {
    

    async upload(request: Request, response: Response, next: NextFunction) {
     
       

        var url = await this.uploadfile(request,response);
        return {
            code:200,
            url
        }
    }

     uploadfile(request: Request, response){
        var url= "/img/";
        return new Promise((resolve,reject)=>{
            upload.single("file")(request,response,(err)=>{
                if(err!=null){
                    reject(err);
                }else{
                    url = url +request.file.filename;
                    console.log(url);
        
                    resolve(url);
                }
               
            });
        })
    }

}