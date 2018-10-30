var admin = require('firebase-admin');
const moment = require('moment');
var serviceAccount = require('./firebasecert.json');
serviceAccount['project_id'] = process.env.FB_PROJECT_ID ;
serviceAccount['private_key_id'] = process.env.FB_PRIVATE_ID ;
serviceAccount['client_email'] = process.env.FB_CLIENT_EMAIL;
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: process.env.FBDB_URL
});
var db = admin.firestore();
var userAsset = db.collection('user-asset');

const ACTION_BUY = 'BUY';
const ACTION_SELL = 'SELL';
const ACTION_DIVIDEND = 'DIVIDEND';
// [START asset API]
module.exports ={
    buyAsset: async (userId, name, vol, type, cost, date) => {
        let d = moment(date, 'DD/MM/YYYY');
        vol = parseFloat(vol);
        cost = parseFloat(cost);
        const snapshot = await findOneAsset(userId, name, type);
        let postData = {};
        if (snapshot.size > 0){
            postData = {
                userId : userId,
                name: name,
                type: type
            };
            await snapshot.forEach(async (doc) => {
                postData.cost = doc.data().cost + cost;
                postData.volume = doc.data().volume + vol;
                logHistory(ACTION_BUY, vol, cost, d.valueOf(),doc.data().history,postData);
                await userAsset.doc(doc.id).set(postData);
            });
        }
        else{
            postData = {
                userId : userId,
                name: name,
                volume: vol,
                cost: cost,
                type: type,
            };
            logHistory(ACTION_BUY, vol, cost, d.valueOf(),[],postData);
            await userAsset.add(postData);
        }
        
    },
    sellAsset: async (userId, name, vol, type, amount, date)=> {
        let d = moment(date, 'DD/MM/YYYY');
        vol = parseFloat(vol);
        amount = parseFloat(amount);
        const snapshot = await findOneAsset(userId, name, type);
        let postData = {};
        if (snapshot.size > 0){
            postData = {
                userId : userId,
                name: name,
                type: type
            };
            await snapshot.forEach(async (doc) => {
                postData.cost = doc.data().cost - amount;
                postData.volume = doc.data().volume - vol;
                logHistory(ACTION_SELL, vol, amount, d.valueOf(),doc.data().history,postData);
                await userAsset.doc(doc.id).set(postData);
            });
            
            
        }
    },
    assetDividend: async (userId, name, vol, type, amount, date)=> {
        let d = moment(date, 'DD/MM/YYYY');
        vol = parseFloat(vol);
        amount = parseFloat(amount);
        const snapshot = await findOneAsset(userId, name, type);
        let postData = {};
        if (snapshot.size > 0){
            postData = {
                userId : userId,
                name: name,
                type: type,
                volume: vol
            };
            await snapshot.forEach(async (doc) => {
                postData.cost = doc.data().cost - amount;
                if (vol != doc.data().volume){
                    postData.volume = vol;
                }
                logHistory(ACTION_DIVIDEND, vol, amount, d.valueOf(),doc.data().history,postData);
                await userAsset.doc(doc.id).set(postData);
            });
            
        }
    },
    updateAsset: async (userId, name, vol, type, amount)=> {
        let d = new Date();
        vol = parseFloat(vol);
        amount = parseFloat(amount);
        const snapshot = await findOneAsset(userId, name, type);
        let postData = {};
        if (snapshot.size > 0){
            postData = {
                userId : userId,
                name: name,
                type: type,
                volume: vol
            };
            await snapshot.forEach(async (doc) => {
                postData.cost = amount;
                postData.volume = vol;
                logHistory(ACTION_DIVIDEND, vol, amount, d.getTime(),doc.data().history,postData);
                await userAsset.doc(doc.id).set(postData);
            });
            
        }
    },
    getUserAsset : async (userId)  => {
        const snapshot = await userAsset
            .where('userId', '==', userId)
            .get();
        return snapshot;
    },
    importAsset: async (userId, name, vol, type, cost, history) => {
        let postData = {
            userId : userId,
            name: name,
            volume: vol,
            cost: cost,
            type: type,
        };
        let newhist = history;
        for (let i in history ){
            let d = new Date(newhist[i].date);
            newhist[i].date = d.getTime();
        }
        postData.history = newhist;
        await userAsset.add(postData);
    }
};
function logHistory(action, volume , amount, time, pre_hist, postData){
    let history = pre_hist;
    history.push({
        action: action,
        volume: volume,
        amount: amount,
        date: time
    });
    postData.history = history;
    return postData;
}
async function findOneAsset(userId, name, type){
    const snapshot = await userAsset
        .where('userId', '==', userId)
        .where('name', '==', name)
        .where('type', '==', type)
        .where('volume', '>', 0)
        .limit(1)
        .get();
    return snapshot;
}