let storage = require('../common/storage');
let heartBeat = {
    //暂时关闭心跳功能
    run: function () {
        if (storage.getMachineType() === 1) {
            return true;
        }
        // let result = mHttp.post('dke', 'deviceHeartBeat', {});
        // if (result.code === 0) {
        //     //
        // }
        // return result['code'] == 0;
    },
}

module.exports = heartBeat;
