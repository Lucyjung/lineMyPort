import axios from 'axios';
axios.defaults.headers.post['Content-Type'] = 'application/json;charset=utf-8';
axios.defaults.headers.post['crossDomain'] = true;
export async function getUserAsset (username) {
    let result = await axios.get(`https://lineportfolio.herokuapp.com/portfolio/${username}`, { headers: { 'crossDomain': true, 'Content-Type': 'application/json'}});
    if (result.status){
        return result.data;
    }
    else{
        return false;
    }
}