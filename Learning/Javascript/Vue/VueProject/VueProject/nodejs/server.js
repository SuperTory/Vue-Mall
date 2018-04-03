const http=require('http');
const url=require('url');
const fs=require('fs');

//1、创建server
let server=http.createServer((req,res)=>{

  //2、获取请求的文件路径
  let pathname=url.parse(req.url).pathname;
  //3、利用fs读取文件
  fs.readFile(pathname.substring(1),function (err,data) {
    if (err){//有错误err，文件未找到
      res.writeHead(404,{
        "Content-Type":"text/html"
      });
    }else{//否则设定状态为200
      res.writeHead(200,{
        "Content-Type":"text/html"
      });
      //写入文件
      res.write(data.toString());
    }
    //在readFile内结束
    res.end();
  });

});

//4、让server一直监听localhost的3000端口的请求
server.listen(3000,'localhost');