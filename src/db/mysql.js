const mysql = require('mysql')

const {MYSQL_CONF} = require('../conf/db')





// 统一执行sql的函数
function exec(sql) {
  
  return new Promise((resolve,reject) => {

    //创建连接对象
    const con = mysql.createConnection(MYSQL_CONF)
    //开始连接
    con.connect()
    //对数据库进行sql操作
    con.query(sql, (err,result) => {
      if (err) {
          reject(err)
          return
      }
      resolve(result)
    })

    //关闭连接
    con.end()
  })
}

module.exports = {
  exec,
  escape: mysql.escape
}