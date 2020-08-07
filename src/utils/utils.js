const jwt = require('jsonwebtoken')


// 时间格式化
function formatDate(inputTime) {
  var date = new Date(inputTime);
  var y = date.getFullYear(); 
  var m = date.getMonth() + 1; 
  m = m < 10 ? ('0' + m) : m; 
  var d = date.getDate(); 
  d = d < 10 ? ('0' + d) : d; 
  var h = date.getHours();
  h = h < 10 ? ('0' + h) : h;
  var minute = date.getMinutes();
  var second = date.getSeconds();
  minute = minute < 10 ? ('0' + minute) : minute; 
  second = second < 10 ? ('0' + second) : second; 
  return y + '-' + m + '-' + d
}

function formatDateTime(inputTime) { 
  var date = new Date(inputTime);
  var y = date.getFullYear(); 
  var m = date.getMonth() + 1; 
  m = m < 10 ? ('0' + m) : m; 
  var d = date.getDate(); 
  d = d < 10 ? ('0' + d) : d; 
  var h = date.getHours();
  h = h < 10 ? ('0' + h) : h;
  var minute = date.getMinutes();
  var second = date.getSeconds();
  minute = minute < 10 ? ('0' + minute) : minute; 
  second = second < 10 ? ('0' + second) : second; 
  return y + '-' + m + '-' + d+' '+h+':'+minute; 
 };


 //鉴权中间件函数
async function authMiddleware  (req ,res, next)  {
  
  const token = String(req.headers.authorization || "").split(" ").pop();
  
  

  if(token) {
    
    jwt.verify(token, global.secret, (error, decode) => {
      
      if(error) {
        res.status(401).send({
          message: '无效的token',
          errno: 1
        })
      }else {
        req.decode = decode
        // req.userInfo = {}
        // req.userInfo.token = jwt.sign({
        //   nickname: decode.nickname,
        //   priority: decode.priority,
        //   userId: decode.userId
        // }, global.secret, {expiresIn: 60*60*24})
        // req.userInfo.nickname = decode.nickname
        // req.userInfo.priority = decode.priority
        // req.userInfo.userId = decode.userId
        next()
      }
    });
  }else {
    res.status(401).send({
      errno: 1,
      message: '没有token'
    })
  }
  
  
 }


 module.exports = {
  formatDate,
  formatDateTime,
  authMiddleware
}