var https = require("https");
var tokenManager = require('./tokenManager.js');

var permanmentMaterialList = [];

var logHead = "MEDIAMGMT";
function log(data)
{
    console.log(logHead + ":\t" + data);
}

/*
 * arguments: object of arguments
 */
function sendPostRequest(path, arguments, data, callback)
{
    var reqPath = path + '?access_token=' + tokenManager.getAccessToken();
    if(arguments)
    {
        for(argument in arguments)
        {
            reqPath += '&' + argument + '=' + arguments[argument];
        }
    }

    var req = https.request(
        {
            hostname : 'api.weixin.qq.com',
            port : 443,
            path : reqPath,
            method : 'POST'
        }, 
        (res)=>
        {
            var returnData = '';
            res.on('data', (d)=>{
                returnData += d;
            });
            res.on('end', ()=>{
                if(callback)
                    callback(returnData);
            });
        }
    );
    req.on('error', (e)=>{
        log(e);
    });
    req.write(data);
    req.end();
}

module.exports.uploadTempMedia = function(mediaType, mediaData, callback, errCallBack)
{
    var path = '/cgi-bin/media/upload'
    var arguments = {
        type : mediaType
    }
    sendPostRequest(path, arguments, mediaData, (response)=>{
        var response = JSON.parse(res);
        if(response.errcode)
        {
            if(errCallBack)
                errCallBack(response);
        }
        else
        {
            if(callback)
                callback(response);
        }
    });
}

module.exports.downLoadTempMaterial = function(media_ID)
{

}

module.exports.getPermanentMaterialList = function(type, offset, count){
    var path = '/cgi-bin/material/batchget_material'
}