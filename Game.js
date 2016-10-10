

function startGame(gameData){
    gameData.currNumber = Math.ceil(Math.random() * 100);
    if (gameData.currNumber < 1 || gameData > 100)
        console.log("invalid gameData: ", gameData.currNumber);
    console.log("Choose number: ", gameData.currNumber);
    gameData.startNumber = 1;
    gameData.endNumber = 100;
    gameData.started = true;
    console.log("Game Started!");
    console.log(gameData);
}

function update(gameData, currNumber)   //0 game end, 1 keep going, 2 currNumber out of range
{
    console.log("At check: \n", gameData);
    console.log(gameData.currNumber+ " "+ currNumber);
    if (gameData.currNumber == currNumber) {
        gameData.started = false;
        return 0;
    }

    if (currNumber < gameData.startNumber || currNumber > gameData.endNumber)
        return 2;

    if (currNumber < gameData.currNumber) {
        gameData.startNumber = currNumber+1;
    }
    else {
        gameData.endNumber = currNumber-1;
    }
    return 1;
}

module.exports.startGame = startGame;
module.exports.update = update;