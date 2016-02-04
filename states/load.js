'use strict';

const config = require('../config');

const textUtil = require('../utils/text');

module.exports = {
  create() {
    this.setupProgress();

    this.loadCharacters();
    this.loadObjects();
    this.loadAudio();
    this.loadFilters();
    this.loadMenus();
    this.loadScenes();
    this.loadLevels();

    this.load.onLoadComplete.add(function startMain() {
      this.state.start('main-menu', true, false, 0);
    }, this);

    this.load.start();
  },

  setupProgress() {
    const progressDisplay = textUtil.addFixedText(
      this.game, 0, 0, '', { fontSize: 36 }
    );

    this.load.onFileComplete.add(function handleProgress(progress) {
      progressDisplay.setText(`${progress}%`);
    }, this);
  },

  loadCharacters() {
    this.load.spritesheet(
      'character', 'assets/character/long-white.png', 64, 64
    );
  },

  loadObjects() {
    this.load.spritesheet('switch', 'assets/torch.png', 50, 116, -1, 78, 78);
    this.load.spritesheet('barrier', 'assets/barrier.png', 128, 128, 3);
    this.load.image('chain', 'assets/chain.png');
  },

  loadAudio() {
    const audioRoot      = 'assets/audio';
    const soundtrackRoot = `${audioRoot}/soundtrack`;
    const sfxRoot        = `${audioRoot}/sfx`;

    this.load.audio('main-soundtrack',  `${soundtrackRoot}/title-or-intro.wav`);
    this.load.audio('scene-soundtrack', `${soundtrackRoot}/intro-strings.wav`);

    this.load.audio('left-footstep-sfx',  `${sfxRoot}/footsteps/left.wav`);
    this.load.audio('right-footstep-sfx', `${sfxRoot}/footsteps/right.wav`);

    for (let x = 0; x < 7; x++) {
      this.load.audio(
        `switch-${x}-sfx`, `${sfxRoot}/switches/switch${x + 1}.wav`
      );
    }

    for (let x = 0; x < 3; x++) {
      this.load.audio(
        `barrier-${x}-sfx`,
        `${sfxRoot}/antagonist-actions/barrier-placement/barrierplacement${x + 1}.wav`
      );
    }

    for (let x = 0; x < 1; x++) {
      this.load.audio(
        `barrier-destroy-${x}-sfx`,
        `${sfxRoot}/player-actions/destroybarrier${x + 1}.wav`
      );
    }

    for (let x = 0; x < 2; x++) {
      this.load.audio(
        `chain-drag-${x}-sfx`,
        `${sfxRoot}/antagonist-actions/chains/chaindrag${x + 1}.wav`
      );
    }

    this.load.audio(
      'chain-attach-sfx', `${sfxRoot}/antagonist-actions/chains/chainattach.wav`
    );

    this.load.audio(
      'puzzle-complete-sfx', `${sfxRoot}/puzzlecomplete/minor.wav`
    );

    this.load.audio('wrong-sfx', `${sfxRoot}/wrong/wrong-c.wav`);
  },

  loadFilters() {
    this.load.script('vignette-filter', 'assets/filters/vignette.js');
  },

  loadMenus() {
    this.load.image('menu-back', 'assets/scenes/backdrops/-1-0.jpg');
    this.load.image('end-back', 'assets/scenes/backdrops/1-1.jpg');
  },

  loadScenes() {
    for (let i = 0; i < config.level.count; i++) {
      this.load.json(`scene-${i}`, `assets/scenes/${i}.json`);
    }

    this.load.image('scene-0-back-0', 'assets/scenes/backdrops/0-0.jpg');
    this.load.image('scene-1-back-0', 'assets/scenes/backdrops/1-0.jpg');

    this.load.image('scene-0-anim-0', 'assets/scenes/animations/0-0.jpg');
    this.load.image('scene-0-anim-1', 'assets/scenes/animations/0-1.jpg');
    this.load.image('scene-0-anim-2', 'assets/scenes/animations/0-2.jpg');
  },

  loadLevels() {
    for (let i = 0; i < config.level.count; i++) {
      this.load.tilemap(
        `map-${i}`,
        `assets/tilemaps/level-${i}.json`,
        null,
        Phaser.Tilemap.TILED_JSON
      );

      this.load.json(`level-${i}`, `assets/levels/${i}.json`);
    }

    this.load.image('terrain-tiles',   'assets/tilemaps/tiles/terrain.png');
    this.load.image('collision-tiles', 'assets/tilemaps/tiles/collision.png');
    this.load.image('switches-tiles',  'assets/tilemaps/tiles/switches.png');
    this.load.image('player-tiles',    'assets/tilemaps/tiles/player.png');
  },
};
