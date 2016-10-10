var XML = require('./XML.js')

var outputMsg = {
    ToUserName : 'aaabbbccc_ddd',
    FromUserName : 'dddcccbbb_aaa',
    CreateTime : Date.now(),
    MsgType : 'text',
    Content : '1'
};
console.log(outputMsg);
console.log(XML.buildXML(outputMsg));
console.log(XML.parseXML(XML.buildXML(outputMsg)));