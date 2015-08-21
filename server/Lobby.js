//Lobby is an array wrapper that stores player socketIDs
var Lobby = function(maxSize, mode) {

  var newLobby = {};
  var players = []; //stores socketIDs

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
    if (newLobby.timer >= timeLimit) {
      newLobby.gameOver();
    }
  };

  var breakTimer = function() {
    newLobby.timer++;
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
    return maxSize <= players.length;
  };

  newLobby.addPlayer = function(socketID) {
    players.push(socketID);
  };

  newLobby.removePlayer = function(socketID) {
    var index = players.indexOf(socketID);
    players.splice(index, 1);
  };

  newLobby.getPlayerIDs = function() {
    return players;
  };

  var currTimer = setInterval(gameTimer, 1000);
  return newLobby;
};

module.exports = {
  Lobby : Lobby
};