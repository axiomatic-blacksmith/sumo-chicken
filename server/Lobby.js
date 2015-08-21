//Lobby is an array wrapper that stores player socketIDs
var Lobby = function(maxSize, mode) {

  var newLobby = {};
  newLobby.players = []; //stores socketIDs

  var timeLimit;
  var breakTime = 15;

  if (mode === 'Hearts') {
    timeLimit = 60;
  } else {
    timeLimit = Infinity;
  }

  newLobby.timer = 0;
  newLobby.gameActive = true;
  newLobby.winner = null;

  var gameTimer = function() {
    newLobby.timer++;
    // console.log('GAME TIME: ', newLobby.timer);
    if (newLobby.timer >= timeLimit) {
      if (typeof newLobby.findWinner === 'function') {
        newLobby.gameOver(newLobby.findWinner());
      } else  {
        newLobby.gameOver(null);
      }
    }
  };

  var breakTimer = function() {
    newLobby.timer++;
    // console.log('GAME OVER: ', newLobby.timer);
    if (newLobby.timer >= breakTime) {
      clearInterval(currTimer);
      newLobby.timer = 0;
      newLobby.gameActive = true;
      newLobby.winner = null;
      currTimer = setInterval(gameTimer, 1000);
    }
  };

  newLobby.gameOver = function(winner) {
    clearInterval(currTimer);
    newLobby.timer = 0;
    newLobby.gameActive = false;
    newLobby.winner = winner;
    currTimer = setInterval(breakTimer, 1000);
  };

  newLobby.full = function() {
    return maxSize <= newLobby.players.length;
  };

  newLobby.addPlayer = function(socketID) {
    newLobby.players.push(socketID);
  };

  newLobby.removePlayer = function(socketID) {
    var index = newLobby.players.indexOf(socketID);
    newLobby.players.splice(index, 1);
  };

  newLobby.getPlayerIDs = function() {
    return newLobby.players;
  };

  var currTimer = setInterval(gameTimer, 1000);
  return newLobby;
};

module.exports = {
  Lobby : Lobby
};