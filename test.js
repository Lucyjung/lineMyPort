const axios = require('axios');
async function getFund() {
    try {
        const response = await axios.get('https://www.thaimutualfund.com/AIMC/aimc_navCenterDownloadRepRep.jsp?date=15/08/2562');
        if (response && response.data){
            let data = response.data.split('\r\n');
            let fundData = [];
            for (let i in data){
                if (data[i] && data[i] != ''){
                    let tmpData = data[i].split(',');
                    if (tmpData.length > 1){
                        fundData = searchFundNav(['K-GOLD'], tmpData);
                    }
                }
            }
            console.log(fundData)
        }
        
    } catch (error) {
        console.error(error);
    }
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
getFund();