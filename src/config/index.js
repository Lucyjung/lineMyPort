// Configuration
module.exports = function() {
    var configObj = {
        // Host Server Setting
        application: {
            port: process.env.PORT ||80
        }
    };
    return configObj;
}();
