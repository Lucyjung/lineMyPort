const AssetController = require('./controllers/AssetController');

module.exports =  [
    {
        method: 'GET',
        path: '/',
        config: {
            cors : true,
        },
        handler: () => {
            return 'Hello World!';
        }
    },
    {
        method: 'GET',
        path: '/portfolio/{user?}',
        config: {
            cors : true,
        },
        handler: AssetController.getAsset
    },
    {
        method: 'POST',
        path: '/portfolio/buy/{user?}',
        config: {
            cors : true,
        },
        handler: AssetController.buyAsset
    },
    {
        method: 'POST',
        path: '/portfolio/sell/{user?}',
        config: {
            cors : true,
        },
        handler: AssetController.sellAsset
    },
    {
        method: 'POST',
        path: '/portfolio/dividend/{user?}',
        config: {
            cors : true,
        },
        handler: AssetController.assetDividend
    },
    {
        method: 'POST',
        path: '/portfolio/update/{user?}',
        config: {
            cors : true,
        },
        handler: AssetController.updateAsset
    },
    {
        method: 'GET',
        path: '/support/',
        config: {
            cors : true,
        },
        handler: AssetController.isSupportStock
    },
    {
        method: 'POST',
        path: '/addHistory/{user?}',
        config: {
            cors : true,
        },
        handler: AssetController.addAssetHistory
    },
    {
        method: 'GET',
        path: '/History/{user?}',
        config: {
            cors : true,
        },
        handler: AssetController.assetHistory
    },
];
