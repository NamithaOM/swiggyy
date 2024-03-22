var express=require('express')
var router=express.Router()
var admin=require('./admin')
var user=require('./user')

router.use('/',user)
router.use('/admin',admin)


module.exports=router
