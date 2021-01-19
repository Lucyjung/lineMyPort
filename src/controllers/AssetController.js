const Asset = require('../models/Asset');
const Fund = require('../services/Fund');
const Exchange = require('../services/Exchange');
const ThaiGold = require('../services/ThaiGold');
const YahooFin = require('../services/YahooFinance');

const ASSET_TYPE = [
    {NAME : 'STOCK', field : 'stock', toUpdatePrice : true, individual : true, dividend : true, updateFunc : YahooFin.getPrice},
    {NAME : 'FUND', field : 'fund', toUpdatePrice : true, individual : false, dividend : true,updateFunc : Fund.getPrice},
    {NAME : 'CASH', field : 'cash', toUpdatePrice : false, individual : false, dividend : false, updateFunc : null},
    {NAME : 'FX', field : 'fx', toUpdatePrice : true, individual : false, dividend : false, updateFunc : Exchange.getPrice},
    {NAME : 'GOLD', field : 'gold', toUpdatePrice : true, individual : false, dividend : false, updateFunc : ThaiGold.getPrice},
    {NAME : 'INSURE', field : 'insure', toUpdatePrice : false, individual : false, dividend : false, updateFunc : null},
];
module.exports = {
    // ********************************************//
    // Name: getAsset
    // Description: 
    //              
    // Parameter :
    //   request : Request Object of Hapi framework
    //   h       : Response like object of Hapi framework
    //
    // Payload
    //   url     : 
    //   requestedURL : 
    // ********************************************//
    getAsset:  async (request, h) => {

        let returnMsg = {
            status: false,
            msg: ''
        };
        if (request.params.user){
            
            let assetSnap = await Asset.getUserAsset(request.params.user);
            let list = await getAssetList(assetSnap);
            list = await getAssetPrice(list);
            let summary = {
                totalMarket : 0,
                totalCost : 0,
                unknown: 0
            };
            for (const asset of ASSET_TYPE){
                summary[asset.field] = 0;
            }
            for (let i  in list.asset){

                summary.totalCost += list.asset[i].cost;
                
                if (list.asset[i].marketPrice > 0 ){
                    summary.totalMarket += list.asset[i].volume * list.asset[i].marketPrice;
                    let info = getAssetInfo(list.asset[i].type.toUpperCase());
                    summary[info.field] += list.asset[i].volume * list.asset[i].marketPrice;
                }
                else{
                    summary.unknown += parseFloat(list.asset[i].cost);
                }
                list.asset[i].cost = numberWithCommas(list.asset[i].cost);
                list.asset[i].PL = (list.asset[i].PL).toFixed(2);
                list.asset[i].avgCost = numberWithCommas(list.asset[i].avgCost);
                list.asset[i].marketValue = numberWithCommas(list.asset[i].marketPrice * list.asset[i].volume);
            }

            returnMsg.status = true;
            returnMsg.msg = 'Success';
            returnMsg.data = list.asset;
            returnMsg.summary = summary;
            returnMsg.profit = list.profit;
            returnMsg.dividendList = list.dividendList;
        }
        else{
            returnMsg.msg = 'User Id required';
        }

        let response = h.response(returnMsg);
        return response;
    },
    buyAsset:  async (request, h) => {
        let returnMsg = {
            status: false,
            msg: ''
        };
        if (request.params.user && request.payload.symbol && request.payload.volume && request.payload.type && request.payload.amount && request.payload.date){
            await Asset.buyAsset(request.params.user, request.payload.symbol, request.payload.volume,request.payload.type, request.payload.amount, request.payload.date);
            returnMsg.status = true;
            returnMsg.msg = 'Success';
        }else{
            returnMsg.msg = 'User Id & Payload required';
        }
        let response = h.response(returnMsg);
        return response;
    },
    sellAsset:  async (request, h) => {
        let returnMsg = {
            status: false,
            msg: ''
        };
        if (request.params.user && request.payload.symbol && request.payload.volume && request.payload.type && request.payload.amount  && request.payload.date){
            await Asset.sellAsset(request.params.user, request.payload.symbol, request.payload.volume,request.payload.type, request.payload.amount, request.payload.date);
            returnMsg.status = true;
            returnMsg.msg = 'Success';
        }else{
            returnMsg.msg = 'User Id & Payload required';
        }
        let response = h.response(returnMsg);
        return response;
    },
    assetDividend:  async (request, h) => {
        let returnMsg = {
            status: false,
            msg: ''
        };
        if (request.params.user && request.payload.symbol && request.payload.volume && request.payload.type && request.payload.amount  && request.payload.date){
            await Asset.assetDividend(request.params.user, request.payload.symbol, request.payload.volume,request.payload.type, request.payload.amount , request.payload.date);
            returnMsg.status = true;
            returnMsg.msg = 'Success';
        }else{
            returnMsg.msg = 'User Id & Payload required';
        }
        let response = h.response(returnMsg);
        return response;
    },
    updateAsset:  async (request, h) => {
        let returnMsg = {
            status: false,
            msg: ''
        };
        if (request.params.user && request.payload.symbol && request.payload.volume && request.payload.type && request.payload.amount){
            await Asset.updateAsset(request.params.user, request.payload.symbol, request.payload.volume,request.payload.type, request.payload.amount);
            returnMsg.status = true;
            returnMsg.msg = 'Success';
        }else{
            returnMsg.msg = 'User Id & Payload required';
        }
        let response = h.response(returnMsg);
        return response;
    },
    isSupportStock:  async (request, h) => {
        let returnMsg = {
            status: false,
        };
        if (request.query.name){
            let price = await YahooFin.getPrice(request.query.name);
            if (price){
                returnMsg.status = true;
            }
        }
        let response = h.response(returnMsg);
        return response;
    },
    addAssetHistory:  async (request, h) => {

        let returnMsg = {
            status: false,
            msg: ''
        };
        if (request.params.user){
            
            let assetSnap = await Asset.getUserAsset(request.params.user);
            let list = await getAssetList(assetSnap);
            
            let updatedList = await getAssetPrice(list);
            updatedList = updatedList.asset.map(el => {
                delete el.history;
                return el;
            }); 
            Asset.addAssetHistory(request.params.user, updatedList);
            returnMsg.status = true;
            returnMsg.msg = 'Success';
        }
        else{
            returnMsg.msg = 'User Id required';
        }

        let response = h.response(returnMsg);
        return response;
    },
    assetHistory:  async (request, h) => {

        let returnMsg = {
            status: false,
            msg: ''
        };
        if (request.params.user ){
            const from = Number(request.query.from);
            const to = Number(request.query.to);
            if (!isNaN(from) && !isNaN(to)){
                try {
                    const historySnap = await Asset.getAssetHistory(request.params.user, from, to);
                    const histories = [];
                    historySnap.forEach( (snap) => {
                        const assets = snap.data().asset;
                        const market = {
                            total : 0,
                            unknown: 0
                        };
                        for (const asset of ASSET_TYPE){
                            market[asset.field] = 0;
                        }
                        for (let asset of assets){
                            let price = asset.volume * asset.marketPrice;
                            if (typeof asset.marketPrice == 'object' && asset.marketPrice.raw){
                                price = asset.volume * asset.marketPrice.raw;
                            }
                            if (!asset.marketPrice){
                                price = asset.cost;
                                market.unknown += price;
                            } else {
                                for (const type of ASSET_TYPE){
                                    if (asset.type.toUpperCase() == type.NAME ){
                                        market[type.field] +=  price;
                                    }
                                }
                            }
                            market.total += price;
                        }
                        const hist = {
                            market : market,
                            date : snap.data().date,
                            timestamp : snap.data().timestamp
                        };
                        histories.push(hist);
                    });
                    returnMsg.status = true;
                    returnMsg.msg = 'Success';
                    returnMsg.data = histories;
                } catch (e){
                    returnMsg.msg = e;
                }
                
            } else {
                returnMsg.msg = 'From, To required';
            }
            
        }
        else{
            returnMsg.msg = 'User Id required';
        }

        let response = h.response(returnMsg);
        return response;
    },
};
function getAssetList(assetSnap){
    return new Promise((fulfilled)=> { 
        let assetList = [];

        let profitList = [];
        let dividendList = {};
        let result = {asset : assetList, profit: profitList, dividendList: dividendList}
        for (const asset of ASSET_TYPE){
            if (asset.toUpdatePrice){
                result[asset.field] = []
            }
        }
        assetSnap.forEach( (asset) => {
            let assetInfo = {
                symbol: asset.data().name,
                type: asset.data().type,
                cost: asset.data().cost,
                volume: asset.data().volume,
                PL: asset.data().cost,
                history: asset.data().history,
                marketPrice: 0
            };
            if (asset.data().volume > 0){
                assetInfo.avgCost = asset.data().cost/asset.data().volume;
                let info = getAssetInfo(assetInfo.type.toUpperCase());
                if (info.toUpdatePrice ){
                    result[info.field].push(asset.data().name)
                }
                assetList.push(assetInfo);
            }
            else{
                let history = asset.data().history;
                let profit = 0.0;
                for (let i in history){
                    if (history[i].action.toUpperCase() == Asset.action.buy){
                        profit -= history[i].amount;
                    }
                    else if (history[i].action.toUpperCase() == Asset.action.sell 
                            || history[i].action.toUpperCase() == Asset.action.dividend){
                        profit += history[i].amount;
                    }
                }
                profitList.push({symbol: asset.data().name, profit: profit.toFixed(2)});
            }
            // get Dividend list
            let histories = asset.data().history;
            for (let iHist in histories){
                if (getAssetInfo(assetInfo.type.toUpperCase()).dividend &&
                  histories[iHist].action.toUpperCase() == Asset.action.dividend){
                    let date = new Date(histories[iHist].date);
                    let year = date.getFullYear();
                    if (dividendList[year]){
                        dividendList[year].amount += histories[iHist].amount;
                        if (dividendList[year].detail[assetInfo.symbol]){
                            dividendList[year].detail[assetInfo.symbol] += histories[iHist].amount;
                        }
                        else{
                            dividendList[year].detail[assetInfo.symbol] = histories[iHist].amount;
                        }
                    }
                    else{
                        dividendList[year] = {};
                        dividendList[year].amount = histories[iHist].amount;
                        dividendList[year].detail = {};
                        dividendList[year].detail[assetInfo.symbol] = histories[iHist].amount;
                    }
                }
            }
        });
        fulfilled(result);
    });
    
}
async function getAssetPrice(list) {
    let priceList = {};
            
    for (let i in ASSET_TYPE){
        if (!ASSET_TYPE[i].individual && typeof ASSET_TYPE[i].updateFunc == 'function'){
            priceList[ASSET_TYPE[i].field] = await ASSET_TYPE[i].updateFunc(list[ASSET_TYPE[i].field]);
        }
    }
    for (let i  in list.asset){

        let price = 0;

        let asset = getAssetInfo(list.asset[i].type.toUpperCase())
        if (asset.toUpdatePrice == false){
            price = list.asset[i].cost;
        }
        else if (asset.individual){
            if (list[asset.field].length > 0 && list[asset.field].indexOf(list.asset[i].symbol) > -1){
                price = await asset.updateFunc(list.asset[i].symbol)
            } 
        } else {
            if (priceList[asset.field] && priceList[asset.field][list.asset[i].symbol] ){
                price = priceList[asset.field][list.asset[i].symbol];
            }
        }

        if (!price){
            price = 0;
        }
        list.asset[i].marketPrice = price;
        if (list.asset[i].cost !=  0 && price != 0){
            list.asset[i].PL = (price - list.asset[i].avgCost)/list.asset[i].avgCost*100;
        }
        else{
            list.asset[i].PL = 0;
        }
        list.asset[i].cost = parseFloat(list.asset[i].cost);
        list.asset[i].PL = parseFloat(list.asset[i].PL);
        list.asset[i].avgCost = parseFloat(list.asset[i].avgCost);
        
    }
    return list;
}
function numberWithCommas(num , digit=2) {
    return num.toFixed(digit).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}
function getAssetInfo(name){
    for (const asset of ASSET_TYPE){
        if (asset.NAME == name){
            return asset;
        }
    }
}