var mongo = require('mongodb').MongoClient
var mong = new mongo('mongodb://localhost:27017')

function database_admin() {
    return mong.connect().then((dbase) => {
        var dataForm = dbase.db('admindb')
        return dataForm
    })
}



module.exports = database_admin()