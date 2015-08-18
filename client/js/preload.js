var preload = function(){

  game.load.bitmapFont('carrier_command',
                        'assets/fonts/bitmapFonts/carrier_command.png',
                        'assets/fonts/bitmapFonts/carrier_command.xml');
  game.load.spritesheet('chicken', 'assets/Chicken.png', 32, 32);
  game.load.image('cloud', 'assets/cloud-platform.png');
  game.load.image('platform', 'assets/platform.png');
  game.load.image('background', 'assets/forest.png');
  game.load.image('lava', 'assets/lava.png'); // lava sourced from: http://walen.se/sprites/?level=picture&id=969

  game.stage.smoothed = false;

  game.stage.backgroundColor = '#141B2D';

  // load music
  game.load.audio('boden', ['assets/audio/bodenstaendig_2000_in_rock_4bit.mp3', 'assets/audio/bodenstaendig_2000_in_rock_4bit.ogg']);
};
