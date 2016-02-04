'use strict';

const audioUtil = require('../utils/audio');

const PhysicsSprite = require('./physics-sprite');

class Barrier extends PhysicsSprite {
  constructor(game, x, y) {
    super(game, x, y, 'barrier', 2, true);

    this.animations.add('up', [ 2, 1, 0 ], 10, false);
    this.animations.add('down', [ 0, 1, 2 ], 10, false);

    this.introSfxCollection = audioUtil.buildSfxCollection(game, 'barrier', 3);
    this.introSfxIndex = game.rnd.integerInRange(
      0, this.introSfxCollection.length - 1
    );
  }

  playIntro() {
    this.animations.play('up');

    this.playIntroSfx();
  }

  playOutro() {
    this.animations.play('down');
  }

  playIntroSfx() {
    this.introSfxCollection[this.introSfxIndex].play();

    this.introSfxIndex++
    this.introSfxIndex %= this.introSfxCollection.length;
  }
}

module.exports = Barrier;
