const Asset = require('../models/Asset');
const Fund = require('../services/Fund');
const YahooFin = require('../services/YahooFinance');
const CASH = 'CASH';
const STOCK = 'STOCK';
const FUND = 'FUND';
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
                cash : 0,
                stock : 0,
                fund : 0,
                unknown: 0
            };
            for (let i  in list.asset){

                summary.totalCost += list.asset[i].cost;

                if (list.asset[i].marketPrice > 0 ){
                    summary.totalMarket += list.asset[i].volume * list.asset[i].marketPrice;
                    if (list.asset[i].type.toUpperCase() == STOCK){
                        summary.stock += list.asset[i].volume * list.asset[i].marketPrice;
                    }
                    else if (list.asset[i].type.toUpperCase() == FUND){
                        summary.fund += list.asset[i].volume * list.asset[i].marketPrice;
                    }
                    else if (list.asset[i].type.toUpperCase() == CASH){
                        summary.cash += list.asset[i].volume * list.asset[i].marketPrice;
                    }
                }
                else{
                    summary.unknown += parseFloat(list.asset[i].cost);
                }
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
};
function getAssetList(assetSnap){
    return new Promise((fulfilled)=> { 
        let assetList = [];
        let fundList = [];
        let stockList = [];
        let profitList = [];
        let dividendList = {};
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
                if (asset.data().type.toUpperCase() == STOCK){
                    stockList.push(asset.data().name);
                }
                else if (asset.data().type.toUpperCase() == FUND){
                    fundList.push(asset.data().name);
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
                if (assetInfo.type.toUpperCase() != CASH &&
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
        fulfilled({fund: fundList, asset: assetList, stock: stockList, profit: profitList, dividendList: dividendList});
    });
    
}
async function getAssetPrice(list) {
    let fundNav = false;
            
    if (list.fund.length > 0){
        fundNav = await Fund.getPrice(list.fund);
    }
    for (let i  in list.asset){

        let price = 0;
        if (list.stock.length > 0 && list.stock.indexOf(list.asset[i].symbol) > -1){
            price = await YahooFin.getPrice(list.asset[i].symbol);
            
        }else if (fundNav && fundNav[list.asset[i].symbol] ){
            price = fundNav[list.asset[i].symbol];
        }
        else if (list.asset[i].type.toUpperCase() == CASH){
            price = list.asset[i].cost;
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
        list.asset[i].cost = parseFloat(list.asset[i].cost).toFixed(2);
        list.asset[i].PL = parseFloat(list.asset[i].PL).toFixed(2);
        list.asset[i].avgCost = parseFloat(list.asset[i].avgCost).toFixed(2);
        
    }
    return list;
}