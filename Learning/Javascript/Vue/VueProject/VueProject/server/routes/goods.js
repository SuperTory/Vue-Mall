const express=require('express');
const router=express.Router();
const mongoose=require('mongoose');
const goods=require('../models/productModel');
const path=require('path');

//连接数据库
mongoose.connect('mongodb://localhost:27017/mall');
mongoose.connection.on('connected',()=>{
  console.log(path.basename(__filename, '..')+"中mongoDB连接成功");
});
mongoose.connection.on('erroe',()=>{
  console.log("mongoDB连接出错");
});
mongoose.connection.on('disconnected',()=>{
  console.log("mongoDB断开连接");
});

//当有get请求到达/goods/的页面时，执行get函数：
router.get('/',(req,res,next)=>{
  //获取请求参数
  let pageSize=parseInt(req.query.pageSize);
  let page=parseInt(req.query.page);
  let sortFlag=req.query.sortFlag;
  let skipPiece=(page-1)*pageSize;//分页查询，跳过前面skip条数据
  let params={
    salePrice:{$gt:req.query.priceGt,$lt:req.query.priceLt}
  };

  //利用goods模板调用mongooseAPI进行数据库查询、排序、跳到指定页
  let goodsModel=goods.find(params).sort({'salePrice':sortFlag}).skip(skipPiece).limit(pageSize);
  goodsModel.exec((err,doc)=>{
    "use strict";
    if (err){
      res.json({
        status:1,
        msg:err.message
      })
    }else {
      res.json({//利用res将数据返回给get请求
        status:0,
        msg:'',
        result:{
          count:doc.length,
          list:doc
        }
      })
    }
  })
});

//将本页面暴露出去
module.exports = router;