const Mongoose=require('mongoose')
let Schema=Mongoose.Schema;

let userSchema=new Schema({
  "userId":String,
  "userName":String,
  "usePwd":String,
  "orderList":Array,
  "cartList":[{
    "productId":String,
    "productName":String,
    "salePrice":Number,
    "productImage":String,
    "checked":Boolean,
    "productNum":String
  }],
  "addressList":[{
    "addressId":String,
    "userName":String,
    "streetName":String,
    "postCode":String,
    "tel":String,
    "isDefault":Boolean
  }]
});

module.exports=Mongoose.model('user',userSchema);