var https = require("https");
var tokenManager = require('./tokenManager.js');

var permanmentMaterialList = [];

/*
 * arguments: object of arguments
 */
function sendPostRequest(path, arguments, data, context, callback, errCallBack)
{
    var reqPath = path + '?access_token=' + tokenManager.getAccessToken();
    if(arguments)
    {
        for(argument in arguments)
        {
            reqPath += '&' + argument + '=' + arguments[argument];
        }
    }

    var req = https.request({
        hostname : 'api.weixin.qq.com',
        port : 443,
        path : reqPath,
        method : 'POST'
    }, (res)=>{
        var response = JSON.parse(res);
        if(response.errcode)
        {
            if(errCallBack)
                errCallBack(context, response);
        }
        else
        {
            if(callback)
                callback(context, response);
        }
    });
    req.write(JSON.stringify(data));
    req.end();
}

module.exports.uploadTempMaterial = function(type, data)
{

}

module.exports.downLoadTempMaterial = function(media_ID)
{

}

module.exports.getPermanentMaterialList = function(type, offset, count){
    var path = '/cgi-bin/material/batchget_material'
}