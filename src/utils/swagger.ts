const path = require('path')
const express = require('express')
const swaggerUI = require('swagger-ui-express')
const swaggerDoc = require('swagger-jsdoc')
const fs = require("fs")

//配置swagger-jsdoc
  const options = {
    definition: {
      openapi: '3.0.0',
      info: {
        title: 'api',
        version: '1.0.0',
        description: `财务管理后台共用接口api`
      }
    },
    // 去哪个路由下收集 swagger 注释
    apis: [path.join(__dirname,'../controller/*.ts')]
  }
  var swaggerJson = function (req, res) {
    res.setHeader('Content-Type', 'application/json');
    res.send(swaggerSpec);
  }
  const swaggerSpec = swaggerDoc(options)
   
  var swaggerInstall = function(app) {
    if (!app){
      app = express()
    }

 
    // 开放相关接口，
    app.get('/swagger.json', swaggerJson);

    const jsonReadData = fs.readFileSync('./dist/swagger.json')

    const jsonData = JSON.parse(jsonReadData);
    
    // 使用 swaggerSpec 生成 swagger 文档页面，并开放在指定路由
    app.use('/swagger', swaggerUI.serve, swaggerUI.setup(jsonData));
  }
  module.exports = swaggerInstall 