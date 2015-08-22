var express     = require('express'),
    http        = require('http'),
    path        = require('path'),
    playerUtils = require('./playerUtils.js'),
    serverUtils = require('./serverUtils.js');
    heartsUtils = require('./heartsUtils.js');

var app = express();
var server = http.Server(app);
var io = require('socket.io')(server);
var port = process.env.PORT || 8080;

app.use(express.static(path.join(__dirname, '../public')));

server.listen(port);

var connectedSockets = []; // keeps track of the socket.io connections

io.on('connection', function(socket) {
  console.log('Connected: ', socket.id);
  connectedSockets.push(socket.id);

  var mode = socket.handshake.query.mode;
  playerUtils.newPlayer(socket.id, mode);

  var playerLobby = serverUtils.getLobbyById(socket.id);

  if(!playerLobby.initialized) {
    if(mode === 'Hearts') {
      heartsUtils.addHeartsToLobby(playerLobby);
      playerLobby.findWinner = function() {
        var winner = playerLobby.players[0];
        if (!winner) return null;
        var hiscore = playerUtils.getPlayers()[winner].score;
        for (var i = 1; i < playerLobby.players.length; i++) {
          var currScore = playerUtils.getPlayers()[playerLobby.players[1]].score;
          if (currScore > hiscore) {
            winner = players[i];
            hiscore = currScore;
          }
        }
        return winner;
      };
    }

    playerLobby.resetGame = function() {
      playerLobby.players.forEach(function (socketID) {
        console.log('resetting game');
        var player = playerUtils.getPlayers()[socketID];
        player.score = 0;
        player.kills = 0;
      });
      if (mode === 'Hearts') {
        heartsUtils.addHeartsToLobby(playerLobby);
      }
    };
    playerLobby.initialized = true;
  }

  if(mode === 'Hearts') socket.emit('syncHeart', playerLobby.getHearts());
  
  socket.on('heartKill', function(data){

    var lobbyPlayersIDs = playerLobby.getPlayerIDs();

    var player = playerUtils.getPlayers()[socket.id];
    player.score++;

    // Remove the heart from the source of truth 
    playerLobby.removeHeart(data.heart);

    lobbyPlayersIDs.forEach(function(socketID){
      io.sockets.connected[socketID].emit('heartKill',{
        player:socket.id,
        heart: data.heart
      });
    });
    
    
  });

  socket.on('username', function(data) {
    playerUtils.setUsername(socket.id, data.username);
  });

  socket.on('sync', function(data) {
    playerUtils.updatePlayer(socket.id, data);
  });

  
  socket.on('death', function(data) {
    var player = playerUtils.getPlayers()[socket.id];
    var killer = (data.killer === null) ? null : playerUtils.getPlayers()[data.killer];
    if (mode === 'Kill Count') {
      player.kills = 0;
      if (data.killer !== null) {
        killer.kills++;
        killer.score++;
        if (killer.score === 5) {
          playerUtils.win(data.killer);
        }
      }
    } else if (mode === 'Hearts') {
      player.kills = 0;
      if (data.killer !== null) {
        killer.kills++;
      }
    } else { // Classic
      player.kills = 0;
      player.score = 0;
      if (killer !== null) {
        killer.kills++;
        killer.score++;
      }
    }
    socket.emit('newLocation', playerUtils.getStartLoc());
  });

  // Pause and unpause players
  socket.on('pause', function() {
    playerUtils.pausePlayer(socket.id,true);
  });
  socket.on('resume', function() {
    playerUtils.pausePlayer(socket.id,false);
  });
  
  socket.on('disconnect', function() {
    console.log('Disconnected: ', socket.id);
    connectedSockets.splice(connectedSockets.indexOf(socket.id), 1);
    playerUtils.dcPlayer(socket.id);
  });
});

// Tell the player to sync with ther server every 50ms (approx 2 frames)
// SENT: a hash with player information at corresponding socketIDs
setInterval(function() {
  connectedSockets.forEach(function(socketID) {
    var currLobby = serverUtils.getLobbyById(socketID);
    // Only send sync info for players that are also in the same lobby
    // as the user with socketID.
    io.sockets.connected[socketID].emit('sync', {
      gameActive: currLobby.gameActive,
      winner: currLobby.winner,
      timer: currLobby.timer,
      chickens: playerUtils.getPlayersByLobby(socketID)
    });
  });
}, 50);

setInterval(function(){

}, 1000);

/*




*/