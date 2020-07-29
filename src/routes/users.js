var express = require('express');
var router = express.Router();
var {checkRegisterInfo, checkLogin} =  require('../controller/users.js')
var {authMiddleware} = require('../utils/utils')
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
  console.log(2222)
  if(req.userInfo) {
    res.send(req.userInfo)
  }
})

module.exports = router;
