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
  let sql1 = `SELECT user_nickname nickname, user_priority priority, user_id userId from users where user_name = '${username}' and user_password = '${password}'`;

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
            priority: userInfo.priority,
            userId: userInfo.userId
          }, global.secret , {expiresIn: 60*60*24})
          return new SuccessModel(token)
        }
      })
    }
     
  })
}


//提交评论信息
const submitComment = async function (commentData) {
  let commentDate = commentData.commentDate
  let articleId = commentData.articleId
  //这里默认评论都是向我写的文章提交的，于是就是1了哈哈哈
  let toId = 1
  let fromId = commentData.answerId
  let commentContent = commentData.commentContent
  let sql = `insert into comment_record(pid, articleId, toId, fromId, commentDate, commentContent) value(0, ${articleId}, ${toId}, ${fromId}, '${commentDate}', '${commentContent}');`
  
  let res = await exec(sql)

  if(res.affectedRows > 0) {
    return new SuccessModel(res.insertId)
  }

}
//提交回复信息
const submitReply = async function (replyData) {
  let articleId = replyData.articleId
  let toId = replyData.toId
  let fromId = replyData.fromId
  let commentDate = replyData.submitDate
  let commentContent = replyData.content
  let pid = replyData.pid
  let sql = `insert into comment_record(pid, articleId, toId, fromId, commentDate, commentContent) value(${pid}, ${articleId}, ${toId}, ${fromId}, '${commentDate}', '${commentContent}');`
  let res = await exec(sql)
  
  if(res.affectedRows > 0) {
    return new SuccessModel(res.insertId)
  }else {
    return new ErrorModel('发表评论失败')
  }
}


//获取指定文章的评论信息
const getComment = async function (articleId) {
  
  let id = articleId
  let sql = `SELECT r.\`id\`, r.\`pid\`, r.\`articleId\`, r.\`toId\`, r.\`fromId\`, r.\`commentDate\`, r.\`commentContent\`, u.\`user_nickname\` toName, f.\`user_nickname\` fromName  FROM myblog.comment_record r INNER JOIN users u ON r.\`toId\` = u.\`user_id\` INNER JOIN users f ON f.\`user_id\` = r.\`fromId\`  where articleId = ${id} order by r.\`pid\` ASC, r.\`commentDate\`  ASC;`
  
  let res = await exec(sql)
  
  
  return new SuccessModel(res)
}



module.exports = {
  checkRegisterInfo,
  checkLogin,
  submitComment,
  getComment,
  submitReply
}