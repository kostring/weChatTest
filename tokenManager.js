var appID = 'wx785b4b38c46a4e80';
var appSecret = 'b14d9c86175f797a2b28a0201d42cc83';
var https = require("https");

var access_token = undefined;
var expires_in = 0;

function TokenManager()
{

}

TokenManager.prototype.updateToken = function()
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
                console.log('get token data: ', resData.access_token, ' expires_in: ', resData.expires_in);
                console.log(typeof(d));
                access_token = resData.access_token;
                expires_in = resData.expires_in;

                //set the timer to refresh the access_token
                setTimeout(()=>{
                    this.updateToken();
                }, (this.expires_in - 10) * 1000);
            });
        });
    req.end();
    req.on('error', (e)=>{
        console.error(e);
    });
}

TokenManager.prototype.getAccessToken = function()
{
    if(access_token)
    {
        return access_token;
    }
    throw new Error("Invalid access token!");
}

/*
 * callback arguments:
 * callback(string : access_token, any : context)
 */
TokenManager.prototype.getAccessTokenAsync = function(callback, context)
{

}

var tokenManager = new TokenManager();
tokenManager.updateToken();
module.exports = tokenManager;

