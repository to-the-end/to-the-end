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

    this.load.audio('puzzleCompleteMinor', 'assets/audio/sfx/puzzlecomplete/minor.wav');

    this.load.image('obstacle', 'assets/obstacle.png');
    this.load.image('chain', 'assets/chain.png');
    this.load.script('vignetteFilter', 'filters/Vignette.js');

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
