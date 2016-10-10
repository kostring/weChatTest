var express = require('express');
var http = require('http');
var wechat = require('wechat');
var WECHATAPI = require('wechat-api');
var crypto = require("crypto");
var tokenManager = require("./tokenManager")();
var wechatMessage = require("./wechatMessage");
var xml2json = require('xml2json');

var users = require('./user.js');
var game = require('./Game.js');

var app = express();     

app.post('/', function (req, res) {
    console.log("FaChuoNa!");
    res.send("");
});


app.get('/', function (req, res) {
    res.send('Hello World!');
});
var token = 'kostring112233'
app.get('/weichat', function (req, res) {
    //console.log(req);
    var signature = req.query.signature;
    var timestamp = req.query.timestamp;
    var nonce = req.query.nonce;
    var echostr = req.query.echostr;
    console.log("signature: \t" + signature + 
                '\ntimestamp: \t' + timestamp + 
                '\nnonce: \t' + nonce + 
                '\nechostr: \t' + echostr + '\n');
    if(!signature || !timestamp || !nonce || !echostr)
    {
        console.log("Incorrect request! Ignore!");
        return;
    }
    var sha1 = crypto.createHash('sha1');    
    var segGeneratorList = [req.query.timestamp, req.query.nonce, token].sort().forEach((value)=>{
        console.log(value);
        sha1.update(value);
    });
    var calCulateSignature = sha1.digest('hex')
    if(calCulateSignature == signature)
    {
        res.send(echostr);
    }
    else
    {
        console.log("Incorrect signature");
    }
});

app.post('/weichat', (req, res, next)=>{
    req.body = '';
    req.on('data', function(chunk){
        req.body += chunk;
    });
    req.on('end', function(){
        req.weChatContext = wechatMessage.parseIncomingMessage(req.body);
        req.weChatContext.req = req;
        req.weChatContext.res = res;
        next();
    });
});

app.post('/weichat', (req, res, next)=>{
    if(req.weChatContext.incomingMsg.msgType == 'text')
    {
        var returnString = wechatMessage.buildTextMessage(req.weChatContext.incomingMsg.content, req.weChatContext.clientData);
        console.log(returnString);
        res.send(returnString);
    }
    else
    {
        next();
    }
});

app.post('/weichat', (req, res, next)=>{
    if(req.weChatContext.incomingMsg.msgType == 'image')
    {
        var returnString = wechatMessage.buildImageMessage(req.weChatContext.incomingMsg.mediaId, req.weChatContext.clientData);
        console.log(returnString);
        res.send(returnString);
    }
    else
    {
        next();
    }
});

app.post('/weichat', (req, res, next)=>{
    console.log("Could not handle this request! Msg type: " + req.weChatContext.incomingMsg.msgType);
    res.send('');
});

var server = app.listen(80, function () {
  var host = server.address().address;
  var port = server.address().port;

  console.log('Example app listening at http://%s:%s', host, port);
});

server.on("error", (e)=>{
    console.log("ERROR:\tServer error.");
    console.log(e);
})
