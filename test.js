const asset = require('./src/models/Asset');
// asset.assetDividend('U28bae1ada29dcce79109253c7083afd3', 'TEST', 1000, 'Stock', 10.00)
test();
async function test(){
    let snap = await asset.getUserAsset('U28bae1ada29dcce79109253c7083afd3');
    snap.forEach( (doc)=>{
        console.log(doc.data())
    });
}