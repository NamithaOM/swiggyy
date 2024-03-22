var express = require('express')
var router = express.Router()
var controller = require('./controller')
var admindb = require('../../config/connection')
const mongo = require('mongodb')
const bcrypt = require('bcrypt')

// 
// router.get('/',controller.users)

// view category
router.get('/', controller.catuser)



// single product
router.get('/singleproduct/:id', controller.userProduct)

// matchproducts
router.get('/matchproducts/:id', controller.matchproduct)

// signup
router.get('/signup', controller.signup)

// insert to signup tbl
router.post('/signup', (req, res) => {
    let signupdata = {
        fullname: req.body.name,
        username: req.body.username,
        password: req.body.password,
        status: 0
    }
    admindb.then((dbase) => {
        bcrypt.hash(req.body.password, 10).then((passResult) => {
            signupdata.password = passResult
            dbase.collection('signup').insertOne(signupdata).then((result) => {
                // console.log(result)
            })


        })
    })
    res.redirect('signup')
})

// login
router.get('/login', controller.login);

router.post('/login', (req, res) => {
    let logindata = {
        usernames: req.body.usernames,
        passwords: req.body.passwords
    }
    admindb.then((dbase) => {
        dbase.collection('signup').findOne({ username: logindata.usernames }).then((result) => {
            // console.log(result);
            let user = result
            if (logindata) {
                bcrypt.compare(logindata.passwords, user.password).then((pass) => {
                    if (pass) {
                        if (user.status == 1) {
                            req.session.user = user
                            res.redirect('/admin')
                        }
                        else {
                            req.session.user = user
                            res.redirect('/')
                        }
                    }
                })
            }
            else {
                console.log('error');
                res.redirect('/login')
            }
        })
    })
})
// logout
router.get('/logout', (req, res) => {
    req.session.destroy()
    res.redirect('/login')
})
// cart insert
router.get('/cart/:id', controller.cart)
//  cart view
router.get('/cart', controller.viewcart)
// delete cart
router.get('/cartdelete/:id', controller.cartdelId)

// view my order
router.get('/order', controller.myorder)

// add order
router.post('/cart',(req,res)=>{
if (req.session.user) {
            let usersId = req.session.user._id
            let admin = false;
            let login = true
            let orderdata = {
                // userId: req.session.user._id,
                status:1
            }
             admindb.then((dbase)=>{
                dbase.collection('cart').updateMany({userid:usersId},{$set:orderdata}).then((cartresult)=>{
                    // console.log(cartresult);
                })
                    res.redirect('order')
                })
            }
        else {
            res.redirect('/login')
        }  
})


module.exports = router