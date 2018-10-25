const Asset = require('../models/Asset');
const Fund = require('../services/Fund');
const YahooFin = require('../services/YahooFinance');

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
            let fundNav = false;
            let summary = {
                totalMarket : 0,
                totalCost : 0,
                cash : 0,
                stock : 0,
                fund : 0,
                unknown: 0
            };
            if (list.fund.length > 0){
                fundNav = await Fund.getPrice(list.fund);
            }

            for (let i  in list.asset){

                summary.totalCost += list.asset[i].cost;
                let price = 0;
                if (list.stock.length > 0 && list.stock.indexOf(list.asset[i].symbol) > -1){
                    price = await YahooFin.getPrice(list.asset[i].symbol);
                    
                }else if (fundNav && fundNav[list.asset[i].symbol] ){
                    price = fundNav[list.asset[i].symbol];
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
                if (price > 0 ){
                    summary.totalMarket += list.asset[i].volume * price;
                    if (list.asset[i].type == 'Stock'){
                        summary.stock += list.asset[i].volume * price;
                    }
                    else if (list.asset[i].type == 'Fund'){
                        summary.fund += list.asset[i].volume * price;
                    }

                }
                else{
                    
                    if (list.asset[i].type == 'Cash'){
                        summary.cash += parseFloat(list.asset[i].cost);
                        summary.totalMarket += parseFloat(list.asset[i].cost);
                    }
                    else{
                        summary.unknown += parseFloat(list.asset[i].cost);
                    }
                }
            }

            returnMsg.status = true;
            returnMsg.msg = 'Success';
            returnMsg.data = list.asset;
            returnMsg.summary = summary;
            returnMsg.profit = list.profit;
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
        if (request.params.name){
            let price = await YahooFin.getPrice(request.params.name);
            if (price){
                returnMsg.status = true;
            }
        }
        let response = h.response(returnMsg);
        return response;
    }
};
function getAssetList(assetSnap){
    return new Promise((fulfilled)=> { 
        let assetList = [];
        let fundList = [];
        let stockList = [];
        let profitList = [];
        assetSnap.forEach( (asset) => {
            let assetInfo = {
                symbol: asset.data().name,
                type: asset.data().type,
                cost: asset.data().cost,
                volume: asset.data().volume,
                PL: asset.data().cost,
                marketPrice: 0
            };
            if (asset.data().volume > 0){
                assetInfo.avgCost = asset.data().cost/asset.data().volume;
                if (asset.data().type == 'Stock'){
                    stockList.push(asset.data().name);
                }
                else if (asset.data().type == 'Fund'){
                    fundList.push(asset.data().name);
                }
                assetList.push(assetInfo);
            }
            else{
                let history = asset.data().history;
                let profit = 0.0;
                for (let i in history){
                    if (history[i].action == 'Buy'){
                        profit -= history[i].amount;
                    }
                    else if (history[i].action == 'Sell' || history[i].action == 'Dividend'){
                        profit += history[i].amount;
                    }
                }
                profitList.push({symbol: asset.data().name, profit: profit.toFixed(2)});
            }
            
        });
        fulfilled({fund: fundList, asset: assetList, stock: stockList, profit: profitList});
    });
    
}