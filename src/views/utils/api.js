import axios from 'axios';
export async function getUserAsset (username) {
    let result = await axios.get(`https://lineportfolio.herokuapp.com/portfolio/${username}`);
    if (result.status){
        return result.data;
    }
    else{
        return false;
    }
}