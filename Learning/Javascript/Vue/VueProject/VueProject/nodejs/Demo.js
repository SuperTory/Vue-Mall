let user=require("./User");
const http=require('http');
const url=require('url');
const util=require('util');

console.log(user.sayHello());
console.log(`I am ${user.username}`);



let server=http.createServer((req,res)=>{
  res.statusCode=200;
  res.setHeader("content-type","text/plain;charset=utf-8");
  console.log(url.parse(req.url));
  res.end(util.inspect(url.parse(req.url)));

});
server.listen(3000,"localhost",()=>{
  console.log("listener call back");
});