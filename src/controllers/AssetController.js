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
            let assetList = [];
            let fundList = [];
            let assetSnap = await Asset.getUserAsset(request.params.user);
            await assetSnap.forEach(async (asset) => {
                let assetInfo = {
                    symbol: asset.data().name,
                    type: asset.data().type,
                    cost: asset.data().cost,
                    volume: asset.data().volume,
                    avgCost: asset.data().cost/asset.data().volume,
                    marketPrice: 0
                };
                let price = 0;
                if (asset.data().type == 'Stock'){
                    price = await YahooFin.getPrice(asset.data().name);
                    if (price){
                        assetInfo.marketPrice = price;
                    }
                }
                else if (asset.data().type == 'Fund'){
                    fundList.push(asset.data().name);
                }
                assetList.push(assetInfo);
            });
            if (fundList.length > 0){
                let fundNav = await Fund.getPrice(fundList);
                for (let i  in assetList){
                    if (fundNav[assetList[i].symbol] ){
                        assetList[i].marketPrice = fundNav[assetList[i].symbol];
                    }
                }
            }
            returnMsg.status = true;
            returnMsg.msg = 'Success';
            returnMsg.data = assetList;
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
