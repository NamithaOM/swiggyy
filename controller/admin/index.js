var express = require('express')
var router = express.Router()
var controller = require('./controller')
var admindb = require('../../config/connection')
const mongo = require('mongodb')

router.get('/',controller.adminhome)

router.get('/category', controller.admn)

router.post('/category',(req,res)=>{
    let catData={
        category:req.body.catname,
        description:req.body.description,
        image:req.files.img.name
    }
    admindb.then((dbase)=>{
        dbase.collection('catagory').insertOne(catData).then((result)=>{
            const fileup = req.files.img
            fileup.mv('./public/images/' + catData.image).then((results)=>{
                // console.log(results)
    
            })
          res.redirect('category')  
        })
    })
    
    })

// delete
router.get('/admindelete/:id',controller.catdelId)
// findone
router.get('/adminUpdate/:id',controller.catogoryUpdate)
// category update
router.post('/adminUpdate/:id',(req,res)=>{
    let editcat= req.params.id
    let updatecat={

        category:req.body.catname,
        description:req.body.description,
        image:req.files?.img.name

    }
    let newValue=''
    if(req.files?.img){
        newValue={
            category:updatecat.category,
            description:updatecat.description,
            image:updatecat.image

          
        }
        let imgupdate = req.files.img
        imgupdate.mv('./public/images/' + updatecat.image)
    }
    else{
        newValue={
            category:updatecat.category,
            description:updatecat.description  
        }
    }
    admindb.then((dbase)=>{
        dbase.collection('catagory').updateOne({_id:new mongo.ObjectId (editcat)},{$set: newValue}).then((result)=>{
     
           console.log(result);

        })
    })
    res.redirect('../category')

})

// subcategory

router.get('/subcategory',controller.admnSubcat)


router.post('/subcategory', (req, res) => {
    let subcatdata = {
        parent_name: req.body.catname,
        sub_name: req.body.subcat
    }
    admindb.then((dbase) => {
        dbase.collection('subCategory').insertOne(subcatdata).then((result) => {
            res.redirect('subcategory')
        })
    })
})



router.get('/subcategoryUpdate/:id', controller.subcatEdit)


router.post('/subcategoryUpdate/:id', (req, res) => {
    let subcateditId = req.params.id
    let newsubcat = {
        sub_name: req.body.subcat
    }
    admindb.then((dbase) => {
        dbase.collection('subCategory').updateOne({ _id: new mongo.ObjectId(subcateditId) }, 
        { $set: newsubcat }).then((result) => {
            // console.log(result);

        })
    })
    res.redirect('../subcategory')

})

router.get('/subcategorydelete/:id',controller.subcatdel)


// commodity

router.get('/commodity',controller.commodity)
   

// commodity insert

router.post('/commodity',(req,res)=>{
    let commoditydt={
        parent_category:req.body.catname,
        sub_category: req.body.subcategory,
        product:req.body.product,
        qty:req.body.quantity,
        price:req.body.price,
        description1:req.body.descriptions,
        picture:req.files.picture.name
    }
    admindb.then((dbase)=>{
        dbase.collection('commodity').insertOne(commoditydt).then((result)=>{
            const commodityup = req.files.picture
            commodityup.mv('./public/images/' + commoditydt.picture).then((results)=>{
                // console.log(result)
    
            })
          res.redirect('commodity')  
        })
    })
    
    })

// commodity delete
    router.get('/commoditydelete/:id',controller.commoditydel)

// commodity update

router.get('/commodityUpdate/:id', controller.commodityEdit)


router.post('/commodityUpdate/:id', (req, res) => {
    let commodityId = req.params.id
    let newcommodity = {
        // sub_name: req.body.subcat,
        product:req.body.product,
        qty:req.body.quantity,
        price:req.body.price,
        description1:req.body.description1,
        picture:req.files?.picture.name
    }
    let newcommodt=''
    if(req.files?.picture){
        newcommodt={
        product:newcommodity.product,
        qty:newcommodity.qty,
        price:newcommodity.price,
        description1:newcommodity.description1,
        picture:newcommodity.picture
        }
        let pictureupdate = req.files.picture
        pictureupdate.mv('./public/images/' + newcommodity.picture)
            }
    else{
        newcommodt={
            product:newcommodity.product,
            qty:newcommodity.qty,
            price:newcommodity.price,
            description1:newcommodity.description1
    }
    
        }

    admindb.then((dbase) => {
        dbase.collection('commodity').updateOne({ _id: new mongo.ObjectId(commodityId) }, { $set: newcommodt }).then((results) => {
            console.log(results);          

        })
    })
    res.redirect('/admin/commodity')

})

// logout
router.get('/logout',(req,res)=>{
    req.session.destroy()
res.redirect('/login')
})

module.exports = router