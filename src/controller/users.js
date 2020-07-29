const {exec,escape} = require('../db/mysql')

const {formatDate,formatDateTime} = require('../utils/utils')
const jwt = require('jsonwebtoken')
var {SuccessModel,ErrorModel} = require('../model/resModel')


//验证注册的nickName是否重复,不重复则提交，重复则返回错误
const checkRegisterInfo = ({nickname, username, password}) => {
  let registerTime = formatDate(Date.now())
  let sql = `select count(1) count from users where user_nickname = '${nickname}'`
  let sql1 = `select count(1) count from users where user_name = '${username}'`
  let sql2 = `insert into users(user_name, user_nickname,user_registration_time,  user_password) value ('${username}', '${nickname}', '${registerTime}' ,'${password}')`
  
  return exec(sql).then(result => {
    if(result[0].count > 0) {
      return new ErrorModel("已经有人使用了这个昵称哦")
    }else {
      return exec(sql1).then(result => {
        if(result[0].count > 0 ) {
          return new ErrorModel("你这个账号已经注册过了哟")
        }else {
          return exec(sql2).then(result => {
            if(result.affectedRows === 1) {
              return new SuccessModel('恭喜您注册成功！')
            } else {
              return new ErrorModel('注册失败。。。未知错误')
            }
          })
        }
      })
    }
    
  })
}


//验证登录信息
const checkLogin = ({username, password}) => {
  let sql = `SELECT count(1) count from users where user_name = '${username}'`
  let sql1 = `SELECT user_nickname nickname, user_priority priority from users where user_name = '${username}' and user_password = '${password}'`;

  return exec(sql).then(result => {
    if(result[0].count === 0) {
      return new ErrorModel('你还没有注册过哦～请先注册一下')
    }else{
      return exec(sql1).then(result => {
        if(result.length === 0) {
          return new ErrorModel('密码错误，请再好好想想。。。')
        }else {
          //如果登录校验成功后返回token给客户端
          let userInfo = result[0]
          
          
          const token = jwt.sign({
            nickname: userInfo.nickname,
            priority: userInfo.priority
          }, global.secret)
          return new SuccessModel(token)
        }
      })
    }
     
  })
}


module.exports = {
  checkRegisterInfo,
  checkLogin
}