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
            if (list.fund.length > 0){
                let fundNav = await Fund.getPrice(list.fund);
                for (let i  in list.asset){
                    if (fundNav && fundNav[list.asset[i].symbol] ){
                        list.asset[i].marketPrice = fundNav[list.asset[i].symbol];
                        if (list.asset[i].cost !=  0){
                            list.asset[i].PL = (list.asset[i].marketPrice - list.asset[i].cost)/list.asset[i].cost*100;
                        }
                        else{
                            list.asset[i].PL = 0;
                        }
                    }
                }
            }
            if (list.stock.length > 0){
                for (let i  in list.asset){
                    if (list.stock.indexOf(list.asset[i].symbol)){
                        let price = await YahooFin.getPrice(list.asset[i].symbol);
                        if (price){
                            list.asset[i].marketPrice = price;
                            if (list.asset[i].cost !=  0){
                                list.asset[i].PL = (list.asset[i].marketPrice - list.asset[i].cost)/list.asset[i].cost*100;
                            }
                            else{
                                list.asset[i].PL = 0;
                            }
                        }
                    }
                    
                }
                
            }
            returnMsg.status = true;
            returnMsg.msg = 'Success';
            returnMsg.data = list.asset;
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
        if (request.params.user && request.payload.symbol && request.payload.volume && request.payload.type && request.payload.cost){
            await Asset.buyAsset(request.params.user, request.payload.symbol, request.payload.volume,request.payload.type, request.payload.cost);
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
        if (request.params.user && request.payload.symbol && request.payload.volume && request.payload.type && request.payload.amount){
            await Asset.sellAsset(request.params.user, request.payload.symbol, request.payload.volume,request.payload.type, request.payload.amount);
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
        if (request.params.user && request.payload.symbol && request.payload.volume && request.payload.type && request.payload.amount){
            await Asset.assetDividend(request.params.user, request.payload.symbol, request.payload.volume,request.payload.type, request.payload.amount);
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
    }
};
function getAssetList(assetSnap){
    return new Promise((fulfilled)=> { 
        let assetList = [];
        let fundList = [];
        let stockList = [];
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
            }
            else{
                assetInfo.avgCost = 0;
            }
            if (asset.data().type == 'Stock'){
                stockList.push(asset.data().name);
            }
            else if (asset.data().type == 'Fund'){
                fundList.push(asset.data().name);
            }
            assetList.push(assetInfo);
        });
        fulfilled({fund: fundList, asset: assetList, stock: stockList});
    });
    
}