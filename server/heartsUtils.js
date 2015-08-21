var randomLocationGenerator = function(){
  // positionX -2000, 2000
  // positionY -2000, 2000
  var neg = function() {
    return Math.random() > 0.5 ? -1 : 1;
  };

  var x = Math.floor(Math.random()*1000*neg());
  var y = Math.floor(Math.random()*(300+400)-400);
  return {x:x, y:y};
};

var Heart = function(x,y) {
  return {
    positionX: x,
    positionY: y,
  };
};

var addHeartsToLobby = function(lobby){
  gameHearts = {};
  gameStart = true;
  heartCounter = 0;

  // initial add to lobby adds random hearts
  for (var i=0; i<25; i++) {
    var heart = Heart(i*80-1000, randomLocationGenerator().y);
    // TODO: unique id
    heart.id = heartCounter;
    gameHearts[heartCounter++] = heart;
  }

  lobby.hasHearts = true;

  lobby.getHearts = function(){
    return gameHearts;
  };

  lobby.gameStarted = function(){
    return gameStart;
  };

  lobby.removeHeart = function(id){
    if(!gameHearts[id]) return null;
    delete gameHearts[id];
  };

  lobby.gameHasStarted = function(){
    gameStart = true;
  };

  lobby.gameHasEnded = function(){
    gameStart = false;
  };

  lobby.addHeart = function(heartLocObj){
    // heartLocObj --- { positionX : x , position Y: y}
    // Should come from the Heart constructor
  };
};

// var startingHearts = function(){
//   console.log("server: calling starting hearts");
//   for (var i=0; i<25; i++) {
//     var heart = Heart(i*80-1000, randomLocationGenerator().y);
//     // TODO: unique id
//     heart.id = i;
//     gameHearts[i] = heart;
//   }
//   gameStart = true;
//   console.log("startingHearts complete, gameStart: "+gameStart);
// };

module.exports = {
  addHeartsToLobby : addHeartsToLobby
};