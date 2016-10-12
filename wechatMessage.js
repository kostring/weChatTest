var xml2json = require('xml2json');

var clientList = require('./client.js');
var config = require('./config.js');
var XML = require('./xml.js')


function parseIncomingMessage(requestString){
    var msg = XML.parseXML(requestString);
    var clientData = clientList.getClientData(msg.FromUserName);

    var incomingMsg = {};

    switch(msg.MsgType)
    {
        case 'text':
            incomingMsg = parseIncomingTextMessage(msg);
            break;
        case 'image':
            incomingMsg = parseIncomingImageMessage(msg);
            break;
        case 'voice':
            incomingMsg = parseIncomingVoiceMessage(msg);
            break;
        case 'video':
            incomingMsg = parseIncomingVideoMessage(msg);
            break;
        case 'shortvideo':
            incomingMsg = parseIncomingShortVideoMessage(msg);
            break;
        case 'location':
            incomingMsg = parseIncomingLocationMessage(msg);
            break;
        case 'link':
            incomingMsg = parseIncomingLinkMessage(msg);
            break;
        case 'event':
            incomingMsg = parseIncomingEventMessage(msg);
            break;
        default:
            console.log(msg);
            throw new Error("Unsupport incoming message type" + msg.msgType);
    }

    clientData.incomingMsg.push(incomingMsg);
    return {
        clientData: clientData,
        incomingMsg : incomingMsg
    };
}

function parseIncomingTextMessage(msg)
{
    var incomingMsg = {};

    incomingMsg.createTime = msg.CreateTime;
    incomingMsg.msgType = msg.MsgType;
    incomingMsg.content = msg.Content;
    incomingMsg.msgId = msg.MsgId;
    return incomingMsg;   
}

function parseIncomingImageMessage(msg)
{
    var incomingMsg = {
        createTime : msg.CreateTime,
        msgType : msg.MsgType,
        picUrl : msg.PicUrl,
        mediaId : msg.MediaId,
        msgId : msg.MsgId
    };
    return incomingMsg;
}

function parseIncomingVoiceMessage(msg)
{
    var incomingMsg = {
        createTime : msg.CreateTime,
        msgType : msg.MsgType,
        mediaId : msg.MediaId,
        format : msg.Format,
        recognition : msg.Recognition,
        msgId : msg.MsgId
    };
    return incomingMsg;    
}

function parseIncomingVideoMessage(msg)
{
    var incomingMsg = {
        createTime : msg.CreateTime,
        msgType : msg.MsgType,
        mediaId : msg.MediaId,
        thumbMediaId : msg.ThumbMediaId,
        msgId : msg.MsgId
    };
    return incomingMsg;      
}

function parseIncomingShortVideoMessage(msg)
{
    var incomingMsg = {
        createTime : msg.CreateTime,
        msgType : msg.MsgType,
        mediaId : msg.MediaId,
        thumbMediaId : msg.ThumbMediaId,
        msgId : msg.MsgId
    };
    return incomingMsg;      
}

function parseIncomingLocationMessage(msg)
{
    var incomingMsg = {
        createTime : msg.CreateTime,
        msgType : msg.MsgType,
        location_X : msg.Location_X,
        location_Y : msg.Location_Y,
        scale : msg.Scale,
        label : msg.Label,
        msgId : msg.MsgId
    };
    return incomingMsg;      
}

function parseIncomingLinkMessage(msg)
{
    var incomingMsg = {
        createTime : msg.CreateTime,
        msgType : msg.MsgType,
        title : msg.Title,
        description : msg.Description,
        url : msg.Url,
        msgId : msg.MsgId
    };
    return incomingMsg;      
}

function parseIncomingEventMessage(msg)
{
    var incomingMsg = {
        createTime : msg.CreateTime,
        msgType : msg.MsgType,
        event : msg.Event
    };

    //subscribe, SCAN, CLICK, VIEW
    if(msg.EventKey)
    {
        incomingMsg.eventKey = msg.EventKey;
    }

    //subscribe, SCAN
    if(msg.Ticket)
    {
        incomingMsg.ticket = msg.Ticket;
    }

    //LOCATION
    if(msg.Latitude)
    {
        incomingMsg.latitude = msg.Latitude;
    }
    if(msg.Longitude)
    {
        incomingMsg.longitude = msg.Longitude;
    }
    if(msg.Precision)
    {
        incomingMsg.precision = msg.Precision;
    }
    return incomingMsg;        
}

function buildTextMessage(msgContent, clientData)
{
    var outputMsg = {
        ToUserName : clientData.clientName,
        FromUserName : config.serverName,
        CreateTime : Date.now(),
        MsgType : 'text',
        Content : msgContent
    };
    console.log(outputMsg);
    return XML.buildXML(outputMsg);
}

function buildImageMessage(mediaId, clientData)
{
    var outputMsg = {
        ToUserName : clientData.clientName,
        FromUserName : config.serverName,
        CreateTime : Date.now(),
        MsgType : 'image',
        Image : {
            MediaId : mediaId
        }
    };
    console.log(outputMsg);
    return XML.buildXML(outputMsg);    
}

function buildVoiceMessage(mediaId, clientData)
{
    var outputMsg = {
        ToUserName : clientData.clientName,
        FromUserName : config.serverName,
        CreateTime : Date.now(),
        MsgType : 'voice',
        Voice : {
            MediaId : mediaId
        }
    };
    console.log(outputMsg);
    return XML.buildXML(outputMsg);    
}

function buildVideoMessage(mediaId, clientData, title, description)
{
    var outputMsg = {
        ToUserName : clientData.clientName,
        FromUserName : config.serverName,
        CreateTime : Date.now(),
        MsgType : 'video',
        Video : {
            MediaId : mediaId
        }
    };
    if(title) outputMsg.Video.Title = title;
    if(description) outputMsg.Video.Description = description;

    console.log(outputMsg);
    return XML.buildXML(outputMsg);    
}

function buildMusicMessage(mediaId, clientData, title, description, musicUrl, HQMusicUrl, thumbMediaId)
{
    var outputMsg = {
        ToUserName : clientData.clientName,
        FromUserName : config.serverName,
        CreateTime : Date.now(),
        MsgType : 'music',
        Music : {
            MediaId : mediaId
        }
    };
    if(title) outputMsg.Music.Title = title;
    if(description) outputMsg.Music.Description = description;
    if(musicUrl) outputMsg.Music.MusicUrl = musicUrl;
    if(HQMusicUrl) outputMsg.Music.HQMusicUrl = HQMusicUrl;
    if(thumbMediaId) outputMsg.Music.thumbMediaId = ThumbMediaId;

    console.log(outputMsg);
    return XML.buildXML(outputMsg);    
}

function buildNewsMessage(mediaId, clientData, items)
{
    var outputMsg = {
        ToUserName : clientData.clientName,
        FromUserName : config.serverName,
        CreateTime : Date.now(),
        MsgType : 'news',
        ArticleCount : items.length,
        Articles : []
    };
    items.foreach((element)=>{
        var item = {};
        if(element.title) item.Title = element.title;
        if(element.description) item.Description = element.description;
        if(element.picUrl) item.PicUrl = element.picUrl;
        if(element.url) item.Url = element.url;
        outputMsg.Articles.push(item);
    });

    console.log(outputMsg);
    return XML.buildXML(outputMsg);    
}

module.exports.parseIncomingMessage = parseIncomingMessage;
module.exports.buildTextMessage = buildTextMessage;
module.exports.buildImageMessage = buildImageMessage;