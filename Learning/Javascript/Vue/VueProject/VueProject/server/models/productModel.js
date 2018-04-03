const mongoose=require('mongoose');
let Schema=mongoose.Schema;

let productSchema=new Schema({
  "productId":String,
  "productName":String,
  "salePrice":Number,
  "productImage":String,
  "checked":Boolean,
  "productNum":String
});
//导出模板
module.exports=mongoose.model('goods',productSchema);