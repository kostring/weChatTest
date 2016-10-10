var xml2json = require('xml2json');

module.exports.parseXML = function(xmlString)
{
    return JSON.parse(xml2json.toJson(xmlString)).xml;
}

function objToXML(obj)
{
    var retStr = '';
    if(!obj || typeof obj != 'object')
    {
        return retStr;
    }
    
    //TODO properties check
    for(name in obj)
    {
        switch(typeof obj[name])
        {
            case 'boolean':
                break;
            case 'string':
                retStr += '<' + name + '>' + '<![CDATA[' + obj[name] + ']]>' + '</' + name + '>';
                break;
            case 'number':
                retStr += '<' + name + '>' + obj[name] + '</' + name + '>';
                break;
            case 'object':
                retStr += '<' + name + '>' + objToXML(obj[name]) + '</' + name + '>';
                break;
            case 'function':
                break;
        }
    }
    return retStr;
}

module.exports.buildXML = function(obj)
{
    var returnStr = '';
    returnStr = '<xml>' + objToXML(obj) + '</xml>';
    return returnStr;
}