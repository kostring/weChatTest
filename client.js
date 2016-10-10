var clientList = {};

function getClientData(fromUserName)
{
    if(clientList[fromUserName] == undefined)
    {
        var client = new Client(fromUserName);
        clientList[fromUserName] = client;
    }
    return clientList[fromUserName];
}

function Client(fromUserName){
    this.clientName = fromUserName;
    this.incomingMsg = [];
    this.outputMsg = [];
}

Client.prototype.getLastIncomingMsg = function()
{
    if(this.incomingMsg.length == 0)
        throw new Error('Client: incoming message is empty.');
    return this.incomingMsg[this.incomingMsg.length - 1];
};

Client.prototype.addNewIncomingMsg = function(incomingMsg)
{
    //TODO the msgId check for duplicated incoming Msg.
    this.incomingMsg.push(incomingMsg);
}

Client.prototype.addNewOutputMsg = function(outputMsg)
{
    this.outputMsg.push(outputMsg);
}

module.exports.getClientData = getClientData;