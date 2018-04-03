const http=require('http');

//利用HTTP请求第三方接口服务
http.get('http://www.baidu.com',(res)=>{
  let data='';
  res.on('data',(temp)=>{//检测到数据，追加到data中
    data+=temp;
  });
  res.on('end',()=>{//数据传输结束
    console.log(data);
  });
});