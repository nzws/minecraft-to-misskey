const axios = require('axios');
const CONFIG = require('../../config/config');

module.exports = function(text) {
    axios.post(`https://${CONFIG.misskey.domain}/api/notes/create`, {
        visibility: 'home',
        text,
        i: CONFIG.misskey.token
      }).then(function (response) {
        console.log('OK:misskey', text);
      }).catch(function (error) {
        console.log(error);
      });
}