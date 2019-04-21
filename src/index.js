const axios = require('axios');
const CONFIG = require('../config/config');
const data = {
    lastunixtime: Math.floor((new Date()).getTime() / 1000),
    lastservertime: 0
};

const postToMisskey = require('./components/postToMisskey');

function run() {
    axios.get(`${CONFIG.dynmap.url}up/world/world/${data.lastunixtime}`).then(function (response) {
        response = response.data;
        if (data.lastunixtime === response.timestamp) { // 同じデータなのでスキップ
            setTimeout(run, CONFIG.dynmap.updaterate);
            return;
        }
        data.lastunixtime = response.timestamp;

        if (data.lastservertime > response.servertime) { // 日が明けた
            postToMisskey(`サーバ時刻 0時 をお知らせします。`);
        }
        data.lastservertime = response.servertime;

        if (response.updates) {
            response.updates.forEach(update => {
                if (update.type !== 'playerjoin' && update.type !== 'playerquit') return;
    
                postToMisskey(`${update.playerName} が${update.type === 'playerjoin' ? '参加' : '退出'}しました！`);
            });
        }

        console.log('OK:dynmap');
        setTimeout(run, CONFIG.dynmap.updaterate);
    }).catch(function (error) {
        console.log(error);
        setTimeout(run, 60 * 1000); // エラったら多分マイクラ死んでるので、1分後に試す
    });
}

run();