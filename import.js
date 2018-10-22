var MongoClient = require('mongodb').MongoClient;
var url = 'mongodb://localhost:27017/';
const asset = require('./src/models/Asset');
MongoClient.connect(url, function(err, db) {
    if (err) throw err;
    var dbo = db.db('port');
    var query = { owner: 'Lucy' };
    dbo.collection('asset').find(query).toArray(function(err, result) {
        if (err) throw err;
        for (let i in result) {
            try {
                asset.importAsset('U28bae1ada29dcce79109253c7083afd3', result[i].name, result[i].volume, result[i].type, result[i].costValue, result[i].history);
            }catch (err){
                console.log(err)
            }
                
            
        }
        db.close();
    });
});