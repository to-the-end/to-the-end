/* eslint-env browser */

'use strict';

module.exports = {
  preload() {

  },

  create() {
    const style = {
      font:     'Raleway',
      fontSize: 36,

      fill:   '#fff',
      stroke: '#000',

      strokeThickness: 3,
    };

    const progressDisplay = this.add.text(0, 0, '', style);

    this.load.image('terrain-tiles', 'assets/tilemaps/tiles/terrain.png');
    this.load.image('collision-tiles', 'assets/tilemaps/tiles/collision.png');
    this.load.image('switches-tiles', 'assets/tilemaps/tiles/switches.png');
    this.load.image('player-tiles', 'assets/tilemaps/tiles/player.png');

    this.load.spritesheet(
      'character', 'assets/character/long-white.png', 64, 64
    );
    this.load.spritesheet('switch', 'assets/lever.png', 32, 32);

    // Background music
    this.load.audio('intro', 'assets/audio/soundtrack/title-or-intro.wav');

    // Sfx
    this.load.audio('leftFootstep', 'assets/audio/sfx/footsteps/left.wav');
    this.load.audio('rightFootstep', 'assets/audio/sfx/footsteps/right.wav');

    for (var x = 0; x < 7; x++){
      this.load.audio('switch' + x, 'assets/audio/sfx/switches/switch' + (x + 1) + '.wav');
    }

    for (var x = 0; x < 3; x++){
      this.load.audio('barrier' + x, 'assets/audio/sfx/antagonist-actions/barrier-placement/barrierplacement' + (x + 1) + '.wav');
    }

    for (var x = 0; x < 1; x++){
      this.load.audio('hua' + x, 'assets/audio/sfx/player-actions/destroybarrier' + (x + 1) + '.wav');
    }

    for (var x = 0; x < 2; x++){
      this.load.audio('chainDrag' + x, 'assets/audio/sfx/antagonist-actions/chains/chaindrag' + (x + 1) + '.wav');
    }

    this.load.audio('chainAttach', 'assets/audio/sfx/antagonist-actions/chains/chainattach.wav');

    this.load.audio('puzzleCompleteMinor', 'assets/audio/sfx/puzzlecomplete/minor.wav');
    this.load.audio('wrong', 'assets/audio/sfx/wrong.wav');

    this.load.spritesheet('obstacle', 'assets/obstacle.png', 128, 128, 3);
    this.load.image('chain', 'assets/chain.png');
    this.load.script('vignetteFilter', 'filters/Vignette.js');

    this.load.image('menu-back', 'assets/scenes/backdrops/-1-0.jpg');

    this.load.image('scene-0-back-0', 'assets/scenes/backdrops/0-0.jpg');
    this.load.image('scene-0-anim-0', 'assets/scenes/animations/0-0.jpg');
    this.load.image('scene-0-anim-1', 'assets/scenes/animations/0-1.jpg');
    this.load.image('scene-0-anim-2', 'assets/scenes/animations/0-2.jpg');

    this.loadScenes();
    this.loadLevels();

    this.load.onFileComplete.add(function handleProgress(progress) {
      progressDisplay.setText(`${progress}%`);
    }, this);

    this.load.onLoadComplete.add(function startMain() {
      this.state.start('mainMenu', true, false, 0);
    }, this);

    this.load.start();
  },

  loadScenes() {
    for (let i = 0; i < 2; i++) {
      this.load.json(`scene-${i}`, `assets/scenes/${i}.json`);
    }
  },

  loadLevels() {
    for (let i = 0; i < 2; i++) {
      this.load.tilemap(`map-${i}`, `assets/tilemaps/level-${i}.json`, null, Phaser.Tilemap.TILED_JSON);
      this.load.json(`level-${i}`, `assets/levels/${i}.json`);
    }
  },
};
