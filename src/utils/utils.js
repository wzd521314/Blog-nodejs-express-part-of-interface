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
  return y + '-' + m + '-' + d+' '+h+':'+minute+':'+second; 
 };


 //鉴权中间件函数
async function authMiddleware  (req ,res, next)  {
  console.log(req.headers);
  
  const token = String(req.headers.authorization || "").split(" ").pop();
  
  const tokenInfo = jwt.verify(token, global.secret);
  req.userInfo = tokenInfo
  await next()
 }


 module.exports = {
  formatDate,
  formatDateTime,
  authMiddleware
}