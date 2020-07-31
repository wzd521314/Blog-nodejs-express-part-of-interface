var express = require('express');
var router = express.Router();
var {checkRegisterInfo, checkLogin, submitComment, getComment, submitReply} =  require('../controller/users.js')
var {authMiddleware} = require('../utils/utils')
const jwt = require('jsonwebtoken')
/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('<p>这里是userpage</p>');
});

router.post('/register', function(req, res , next){
  let registerInfo = req.body
  
  checkRegisterInfo(registerInfo).then(result => {
    
    res.send(result)
    
  })
})

router.post('/login', function(req, res , next) {
  
  checkLogin(req.body).then(result => {
    res.send(result)
  })
})

router.post('/token', authMiddleware, function(req, res, next) {
  if(req.decode) {
    req.userInfo = {}
    req.userInfo.token = jwt.sign({
      nickname: req.decode.nickname,
      priority: req.decode.priority,
      userId: req.decode.userId
    }, global.secret, {expiresIn: 60*60*24})
    req.userInfo.nickname = req.decode.nickname
    req.userInfo.priority = req.decode.priority
    req.userInfo.userId = req.decode.userId


    res.send(req.userInfo) 
  }
})





//提交评论接口
router.post('/submitComment', authMiddleware, function(req, res , next) {
  
  if(req.decode) {
    submitComment(req.body.commentData).then(result => {
      res.send(result)
    })
  }
})


//提交回复接口
router.post('/submitReply', authMiddleware, function(req, res , next) {
  
  if(req.decode) {
    submitReply(req.body.replyData).then(result => {
      res.send(result)
    })  
  }
})


//获取文章评论信息接口
router.post('/getComment', function(req, res, next) {

  getComment(req.body.articleId).then(result => {
    res.send(result)
  })

})

module.exports = router;
