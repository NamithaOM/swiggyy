var admindb = require('../../config/connection')
const mongo = require('mongodb')

exports.adminhome = (req, res) => {
    res.render('admin/admin', { admin: true })
}

// find from category
exports.admn = (req, res) => {
    admindb.then((dbase) => {
        dbase.collection('catagory').find({}).toArray().then((result) => {
            // console.log(result);
            res.render('admin/category', { result, admin: true })
        })
    })
}

// delete from category
exports.catdelId = (req, res) => {
    let delcategory = req.params.id
    admindb.then((dbase) => {
        dbase.collection('catagory').deleteOne({ _id: new mongo.ObjectId(delcategory) }).then((result) => {
            // console.log(result);
            res.redirect('../category')
        })
    })
}

exports.catogoryUpdate = (req, res) => {

    let findcat = req.params.id
    admindb.then((dbase) => {
        dbase.collection('catagory').findOne({ _id: new mongo.ObjectId(findcat) }).then((result) => {
            console.log(result);
            res.render('admin/adminUpdate', { result, admin: true })

        })
    })
}


// subcategory

exports.admnSubcat = (req, res) => {

    admindb.then(async (dbase) => {
        var result = await dbase.collection('catagory').find({}).toArray()
        var subcatresult = await dbase.collection('subCategory').aggregate([
            { "$addFields": { "catogoryId": { "$toObjectId": "$parent_name" } } },
            {
                $lookup:
                {
                    from: 'catagory',
                    localField: 'catogoryId',
                    foreignField: '_id',
                    as: "newdatas"
                }
            }, { $unwind: '$newdatas' }

        ]).toArray()

        // console.log(subcatresult)
        res.render('admin/subcategory', { result, subcatresult, admin: true })
    })
}

exports.subcatEdit = (req, res) => {
    let findsubId = req.params.id
    admindb.then(async (dbase) => {
        var subcatresult = await dbase.collection('catagory').find({}).toArray()
        var result = await dbase.collection('subCategory').findOne({ _id: new mongo.ObjectId(findsubId) })
        // console.log(result)
        res.render('admin/subcategoryUpdate', { result, subcatresult, admin: true })
    })
}



exports.subcatdel = (req, res) => {
    let delsubcat = req.params.id
    admindb.then((dbase) => {
        dbase.collection('subCategory').deleteOne({ _id: new mongo.ObjectId(delsubcat) }).then((result) => {
            // console.log(result);
            res.redirect('../subcategory')
        })
    })
}


// commodity
exports.commodity = (req, res) => {
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
        res.render('admin/commodity', { result, subcatresult, commodityresult, admin: true })
    })
}

exports.commoditydel = (req, res) => {
    let delcommodity = req.params.id
    admindb.then((dbase) => {
        dbase.collection('commodity').deleteOne({ _id: new mongo.ObjectId(delcommodity) }).then((result) => {
            // console.log(result);
            res.redirect('../commodity')
        })
    })
}

exports.commodityEdit = (req, res) => {
    let findcommoId = req.params.id
    admindb.then(async (dbase) => {
        var result = await dbase.collection('catagory').find({}).toArray()
        var subcatresult = await dbase.collection('subCategory').find({}).toArray()
        var commodityresult = await dbase.collection('commodity').findOne({ _id: new mongo.ObjectId(findcommoId) })

        // console.log(commodityresult)
        res.render('admin/commodityUpdate', { result, subcatresult, commodityresult, admin: true })
    })
}


