var express = require('express');
var router = express.Router();
const mongoose=require('mongoose');
var user=require('../models/userModel');
var goods=require('../models/productModel');
var path = require('path');
require('../utils/util');

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

//返回登陆cookie
router.get('/checkLogin',(req,res)=>{
  "use strict";
  if(req.cookies.userId){
    res.json({
      status:0,
      msg:"登录成功",
      username:req.cookies.userName
    })
  }else {
    res.json({
      status:3,
      msg: "未登录"
    })
  }
});

//用户登陆
router.post('/login', function(req, res, next) {
  let username=req.body.username;
  let password=req.body.password;
  let params={
    userName:username,
    userPwd:password
  };
  user.findOne(params,(err,userDoc)=>{
    "use strict";
    if(err){
      res.json({
        status:1,
        msg:err.message
      })
    }else {
      if(userDoc){
        //登陆成功后设置res.cookie与req.session
        res.cookie('userId',userDoc.userId,{
          maxAge:1000*60*60*6
        });
        res.cookie('userName',userDoc.userName,{
          maxAge:1000*60*60*6
        });
        res.json({
          status:0,
          msg:'登陆成功',
          result:userDoc.userName
        });
      }else{
        res.json({
          status:1,
          msg:'用户名或密码错误！'
        });
      }
    }
  })
});

//添加购物车
router.post('/addCart',(req,res,next)=>{

  "use strict";
  let userId=req.body.userId;
  let productId=req.body.productId;
  let params={
    userId
  };

  user.findOne(params,(err,userDoc)=>{
    if (err){
      res.json({
        status:1,
        msg:err.message
      });
    }else{
      if(userDoc){
        let inCart=false;
        userDoc.cartList.forEach(function(item){
          if (item.productId===productId){
            inCart=true;
            item.productNum++;
            saveDoc(userDoc,res);
          }
        });
        //所选商品不在购物车内，则从商品列表内查找并添加到购物车
        if(!inCart){
          goods.findOne({productId},(err,goodsDoc)=>{
            if(err){
              res.json({
                status:1,
                msg:err.message
              })
            }else{
              goodsDoc.checked=true;
              goodsDoc.productNum=1;
              userDoc.cartList.push(goodsDoc);
              saveDoc(userDoc,res);
            }
          });
        }
      }
    }
  })
});

function saveDoc(doc,res) {
  //保存操作
  doc.save((err,doc)=>{
    if (err){
      res.json({
        status:1,
        msg:err.message
      })
    }else {
      res.json({
        status:0,
        msg:"添加购物车成功",
        result:'success'
      })
    }
  })
}

//删除购物车
router.post('/deleteCart',(req,res)=>{
  "use strict";
  let productId=req.body.productId;
  let userId=req.cookies.userId;
  user.update({userId:userId},{
    $pull:{
      cartList:{productId:productId}
    }
  },(err,doc)=>{
    if(err){
      res.json({
        status:1,
        msg:'数据库删除失败'
      })
    }else{
      if(doc){
        res.json({
          status:0,
          msg:'购物车删除成功'
        })
      }
    }
  })
});

//修改购物车
router.post('/editCart',(req,res)=>{
  "use strict";
  let productId=req.body.productId;
  let checked=req.body.checked;
  let productNum=req.body.productNum;
  let userId=req.cookies.userId;

  user.update({userId:userId,'cartList.productId':productId},{
    $set:{"cartList.$.checked":checked,"cartList.$.productNum":productNum}
  },(err,doc)=>{
    if(err){
      res.json({
        status:1,
        msg:err.message
      })
    }else {
      res.json({
        status:0,
        msg:'购物车更新成功'
      })
    }
  })
});

//查询购物车
router.get('/getCart',(req,res)=>{
  "use strict";
  user.findOne({userId:req.cookies.userId},(err,doc)=>{
    if(doc){
      res.json({
        status:0,
        msg:'',
        result:{
          list:doc.cartList
        }
      })
    }else{
      res.json({
        status:1,
        msg:"购物车列表查询失败"
      })
    }
  })
});

//购物车全选
router.post('/selectAll',(req,res)=>{
  let userId=req.cookies.userId;
  let allSelected=req.body.allSelected;
  console.log(allSelected);
  user.findOne({userId},(err,userDoc)=>{
    "use strict";
    if (err){
      res.json({
        status:1,
        msg:'查询数据库失败'
      })
    }else{
      if(userDoc){
        userDoc.cartList.forEach((item)=>{
          item.checked=allSelected;
        })
      }
      userDoc.save((err,doc)=>{
        if(err){
          resJson(res,1,'写入数据库失败')
        }else{
          resJson(res,0,'全选成功')
        }
      })
    }
  })
});

//登出
router.get('/logout',(req,res)=>{
  "use strict";
  res.cookie('userId','',{maxAge:0});
  res.cookie('userName','',{maxAge:0});
  resJson(res,0,'登出成功');
});

//封装返回函数
function resJson(res,status,msg,result) {
  res.json({
    status:status,
    msg:msg,
    result:result
  })
}


/*----------------------------------地址页面请求-------------------------*/
//获取地址列表
router.get('/address',(req,res)=>{
  "use strict";
  let userId=req.cookies.userId;
  user.findOne({userId},(err,userDoc)=>{
    if(userDoc){
      resJson(res,0,'',userDoc.addressList)
    }else{
      resJson(res,1,'查询地址列表失败');
    }
  })
});

//设置默认地址
router.post('/defaultAddress',(req,res)=>{
  "use strict";
  let userId=req.cookies.userId;
  let addressId=req.body.addressId;
  user.findOne({userId},(err,userDoc)=>{
    if(userDoc){
      userDoc.addressList.forEach((item)=>{
        if(item.addressId===addressId){
          item.isDefault=true;
        }else{
          item.isDefault=false;
        }
      });
      userDoc.save((err,doc)=>{
        if(err){
          resJson(res,5,err.msg);
        }else{
          resJson(res,0,"默认地址设置成功");
        }
      })

    }
  })
});

//删除地址
router.post('/deleteAddress',(req,res)=>{
  "use strict";
  let userId=req.cookies.userId;
  let addressId=req.body.addressId;
  user.update({userId},{
    $pull:{
      addressList:{addressId}
    }
  },(err,doc)=>{
    if(err){
      resJson(res,1,err.msg);
    }else{
      resJson(res,0,'删除地址成功');
    }
  })
});

/*-------------------------请求确认---------------------*/
//订单确认
router.post('/confirmOrder',(req,res)=>{
  "use strict";
  let userId=req.cookies.userId;
  let addIndex=req.body.addIndex;
  let orderTotal=req.body.orderTotal;
  let goodsList=[];
  let platform='6227';
  let date=new Date().Format('yyyyMMddhhmmss');
  let orderId=platform+userId+date;
  var createDate = new Date().Format('yyyy-MM-dd hh:mm:ss');

  user.findOne({userId},(err,userDoc)=>{
    if(userDoc){
      userDoc.cartList.forEach((item)=>{
        if(item.checked){
          goodsList.push(item);
        }
      });
      let order={
        orderId,
        addressId:userDoc.addressList[addIndex].addressId,
        orderTotal,
        goodsList,
        createDate,
        orderStatus:1
      };
      userDoc.orderList.push(order);
      userDoc.save((saveErr,doc)=>{
        if(saveErr) resJson(res,1,saveErr.message)
        else resJson(res,0,'订单生成！',{orderId});
      })
    }else{
      resJson(res,1,err);
    }
  })
});

/*--------------success.vue---------------*/
router.post('/getTotal',(req,res)=>{
  let userId=req.cookies.userId;
  let orderId=req.body.orderId;

  user.findOne({userId},(err,userDoc)=>{
    "use strict";
    if(userDoc){
      let orderTotal=0;
      userDoc.orderList.forEach((item)=>{
        if(item.orderId===orderId) orderTotal=item.orderTotal;
      });
      if(orderTotal===0){
        resJson(res,201,'用户无此订单')
      }else{
        resJson(res,0,'返回orderTotal',orderTotal);
      }
    }else{
      resJson(res,1,'获取orderTotal失败');
    }
  })

});

module.exports = router;
