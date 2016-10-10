var appID = 'wx785b4b38c46a4e80';
var appSecret = 'b14d9c86175f797a2b28a0201d42cc83';
var https = require("https");

var access_token = 'invalid';
var expires_in = 0;

function updateToken()
{
    var req = https.request({
        hostname: 'api.weixin.qq.com',
        port: 443,
        path: '/cgi-bin/token?grant_type=client_credential&appid=' + appID + '&secret=' + appSecret,
        method: 'GET'
        }, 
        (res) =>{
            console.log('get token status', res.statusCode);
            res.setEncoding('utf8');
            res.on('data', (d)=>{
                var resData = JSON.parse(d);
                console.log('get token data: ', resData.access_token);
                console.log(typeof(d));
                access_token = resData.access_token;
                expires_in = resData.expires_in;
                setInterval(()=>{
                    this.updateToken();
                }, (this.expires_in - 10) * 1000);
            });
        });
    req.end();
    req.on('error', (e)=>{
        console.error(e);
    });
}

module.exports = function(){
    updateToken.call(this);
}

module.exports.prototype.updateToken = updateToken;
module.exports.prototype.getToken = function(){
    return 
}

