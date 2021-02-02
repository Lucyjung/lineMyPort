var admin = require('firebase-admin');
const moment = require('moment');
var serviceAccount = require('./firebasecert.json');
serviceAccount['project_id'] = process.env.FB_PROJECT_ID || 'fir-1-4004c';
serviceAccount['private_key_id'] = process.env.FB_PRIVATE_ID || '5a73a43c715aa4b161a1f51830457269afc1d2d5';
serviceAccount['client_email'] = process.env.FB_CLIENT_EMAIL || 'firebase-adminsdk-4h3lp@fir-1-4004c.iam.gserviceaccount.com';
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: process.env.FBDB_URL
});
const settings = {timestampsInSnapshots: true};
admin.firestore().settings(settings);
var userAsset = admin.firestore().collection('user-asset');
var userAssetHistory = admin.firestore().collection('user-asset-history');

const ACTION_BUY = 'BUY';
const ACTION_SELL = 'SELL';
const ACTION_DIVIDEND = 'DIVIDEND';
// [START asset API]
module.exports ={
    action : {
        buy : ACTION_BUY,
        sell : ACTION_SELL,
        dividend: ACTION_DIVIDEND
    },
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
    },
    addAssetHistory: async (userId, assetArr )=>{
        const date = moment().format('YYYYMMDD');
        const snapshot = await findAssetHistoryByDate(userId, date);
        const postData = {
            userId : userId,
            date: date,
            timestamp: moment().unix(),
            asset: assetArr
        };
        if (snapshot.size == 0){
            userAssetHistory.add(postData);
        } else {
            await snapshot.forEach(async (doc) => {
                await userAssetHistory.doc(doc.id).set(postData);
            });
        }
        
    },
    getAssetHistory: async (userId, from , to )=>{
        const snapshot = await findAssetHistoryByDateFromTo(userId, from, to);
        return snapshot;
        
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
async function findAssetHistoryByDate(userId, date){
    const snapshot = await userAssetHistory
        .where('userId', '==', userId)
        .where('date', '==', date)
        .limit(1)
        .get();
    return snapshot;
}
async function findAssetHistoryByDateFromTo(userId, from ,to){
    const snapshot = await userAssetHistory
        .where('userId', '==', userId)
        .where('timestamp', '>=', from)
        .where('timestamp', '<=', to)
        .orderBy('timestamp', 'asc')
        .get();
    return snapshot;
}