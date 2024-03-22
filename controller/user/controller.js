var admindb = require('../../config/connection')
const mongo = require('mongodb')



// exports.users=(req,res)=>{
// res.render('user/user')
// }

// find from category for all category
exports.catuser = (req, res) => {
    admindb.then(async (dbase) => {
        const result = await dbase.collection('catagory').find({}).toArray()
        var subcatresult = await dbase.collection('subCategory').find({}).toArray()
        var commodityresult = await dbase.collection('commodity').aggregate([

            { "$addFields": { "catogoryId": { "$toObjectId": "$parent_category" } } },
            {
                $lookup:
                {
                    from: 'catagory',
                    localField: 'catogoryId',
                    foreignField: '_id',
                    as: "newdatas"
                }
            }, { $unwind: '$newdatas' }
            , { "$addFields": { "subid": { "$toObjectId": "$sub_category" } } },

            {
                $lookup:
                {
                    from: 'subCategory',
                    localField: 'subid',
                    foreignField: '_id',
                    as: "commo_newdt"
                }

            }

            , { $unwind: '$commo_newdt' }

        ]).toArray()
        // console.log(commodityresult)
        res.render('user/user', { result, subcatresult, commodityresult })
    })
}



// // singleproduct
// exports.userProduct=(req,res)=>{
//     res.render('user/singleproduct')
// }


exports.userProduct = (req, res) => {
    let findcommoId = req.params.id
    admindb.then(async (dbase) => {
        var result = await dbase.collection('catagory').find({}).toArray()
        var subcatresult = await dbase.collection('subCategory').find({}).toArray()
        var commodityresult = await dbase.collection('commodity').findOne({ _id: new mongo.ObjectId(findcommoId) })

        // console.log(commodityresult)
        res.render('user/singleproduct', { result, subcatresult, commodityresult })
    })
}


// // matchproduct
exports.matchproduct = (req, res) => {
    let matchId = req.params.id
    // console.log(matchId);
    admindb.then(async (dbase) => {
        const result = await dbase.collection('catagory').findOne({ _id: new mongo.ObjectId(matchId) })
        const commodityresult = await dbase.collection('commodity').aggregate([
            { $match: { parent_category: matchId } },

            { "$addFields": { "catogoryId": { "$toObjectId": "$parent_category" } } },
            {
                $lookup:
                {
                    from: 'catagory',
                    localField: 'catogoryId',
                    foreignField: '_id',
                    as: "newcart"
                }
            }, { $unwind: '$newcart' }

        ]).toArray();
        // console.log(commodityresult);          

        res.render('user/matchproducts', { commodityresult, result })
    })
}


//  signup
exports.signup = (req, res) => {
    res.render('user/signup')
}
//  login
exports.login = (req, res) => {

    if (req.session.user) {
        // User is logged in
        let admin = false;
        res.render('user/login', { login: true, admin, reg: req.session.user, layout: 'layout' });
    } else {
        // User is not logged in
        res.render('user/login', { login: false, admin: false, reg: null });
    }
};

//  cart
exports.cart = (async (req, res) => {
    // let userSession=req.session.user
    if (req.session.user) {
        let admin = false;
        let login = true

        let cartId = req.params.id
        let cartData = {
            userid: req.session.user._id,
            productId: cartId,
            status: 0
        }
        // console.log('cartData');


        await admindb.then((dbase) => {
            dbase.collection('cart').insertOne(cartData).then((results) => {
                // console.log(results)
            })
            res.redirect('/cart')
        })
    }

    else {

        res.redirect('/login')

    }

})



exports.viewcart = (req, res) => {
    if(req.session.user){
        // const cartuser=req.session.user._id

        let admin=false
        let login=true

    admindb.then(async (dbase) => {
        const commodityresult = await dbase.collection('commodity').find({}).toArray()
        const cartresult = await dbase.collection('cart').aggregate([
            { $match: { userid: req.session.user._id } },
            { "$addFields": { "cartId": { "$toObjectId": "$productId" } } },
            {
                $lookup:
                {
                    from: 'commodity',
                    localField: 'cartId',
                    foreignField: '_id',
                    as: "newcartdatas"
                }
            }, { $unwind: '$newcartdatas' }

        ]).toArray();
        // console.log(cartresult);
        res.render('user/cart', { commodityresult, cartresult,login,admin })
    })
}
else
{
    res.redirect('/')

}}

// delete from cart
exports.cartdelId=(req,res)=>{
    if(req.session.user){
        let admin=false
        let login=true

    let delcart=req.params.id
    admindb.then((dbase)=>{
        dbase.collection('cart').deleteOne({_id:new mongo.ObjectId(delcart)}).then((result)=>{
            // console.log(result);
            res.redirect('../cart')
        })
    })
}
else{
    res.redirect('../cart')

}
}

