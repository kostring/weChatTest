
var userList = new Object();

function createUser(openID){
    var user = {
        openID: openID,
        lastMsgID: 0,
        lastMessageReceivedTime: Date(),
        gameData: {
            started: false,
            startNumber: 1,
            endNumber: 100,
            currNumber: 0
        }
    };
    userList[user.openID] = user;
    return user;
}

function findUser(openID){
    return userList[openID];
}

function updateLastMsgID(openID, msgID)
{
    var user = findUser(openID).lastMsgID = msgID;
    user.lastMessageReceivedTime = Date();
}

module.exports.userList = userList;
module.exports.createUser = createUser;
module.exports.findUser = findUser;
module.exports.updateLastMsgID = updateLastMsgID;