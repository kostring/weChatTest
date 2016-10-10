var https = require('https');
var tokenManager = require('./tokenManager.js');

api.weixin.qq.com/cgi-bin/menu/create?access_token=ACCESS_TOKEN

function updateMenuData()
{
    var req = https.request(
        {
            host: 'api.weixin.qq.com',
            path: '/cgi-bin/menu/create?access_token'
        }
    )
}