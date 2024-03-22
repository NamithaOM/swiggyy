var express = require('express');
var router = express.Router();
var controller=require('../controller')

/* GET home page. */
router.use('/',controller)

module.exports = router;
