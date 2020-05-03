var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('<p>这里是userpage</p>');
});

module.exports = router;
