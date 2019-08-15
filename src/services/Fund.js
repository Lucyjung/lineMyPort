// Fund Service
const axios = require('axios');
module.exports = {

    getPrice: async (symbols) => {
        const LIMIT_RETRIES = 7;
        if (symbols.length <= 0){
            return null;
        }
        else{
            for (let i = 0; i < LIMIT_RETRIES; i++){
                try{
                    let price_list = await getFund(symbols,i);
                    if (price_list && Object.keys(price_list).length > 0){
                        return price_list;
                    }
                }catch (err){
                    continue;
                }
            }
        }
        
    }
};
async function getFund(symbols, subtract_day) {
    if (!subtract_day) subtract_day = 0;
    const moment = require('moment');
    let d= moment().subtract(subtract_day, 'days').add(543,'year').format('DD/MM/YYYY');
    let fundData = {};
    const response = await axios.get('https://www.thaimutualfund.com/AIMC/aimc_navCenterDownloadRepRep.jsp?date=' + d);
    if (response && response.data){
        let data = response.data.split('\r\n');
        
        for (let i in data){
            if (data[i] && data[i] != ''){
                let tmpData = data[i].split(',');
                if (tmpData.length > 1){
                    fundData = searchFundNav(symbols, tmpData);
                }
            }
        }
    }
    return fundData;    
}
function searchFundNav(symbols, fundRawArr){
    let result = {};
    const ROW_SIZE = 12;
    let colSize = Math.floor(fundRawArr.length / ROW_SIZE);
    for (let col = 0 ; col < colSize; col++){
        if (!fundRawArr[(col * ROW_SIZE) + 6]){
            break;
        }
        let fundName = fundRawArr[(col * ROW_SIZE) + 6];
        fundName = fundName.replace(new RegExp('"', 'g'), '');
        if (symbols.indexOf(fundName) > -1){
            let nav = fundRawArr[(col * ROW_SIZE) + 8];
            nav = nav.replace(new RegExp('"', 'g'), '');
            result[fundName] = nav;
        }

    }
    return result ;
}
