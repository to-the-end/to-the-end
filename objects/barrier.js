'use strict';

const audioUtil = require('../utils/audio');

const PhysicsSprite = require('./physics-sprite');

class Barrier extends PhysicsSprite {
  constructor(game, x, y) {
    super(game, x, y, 'barrier', 2, true);

    this.animations.add('up', [ 2, 1, 0 ], 10, false);
    this.animations.add('down', [ 0, 1, 2 ], 10, false);

    this.introSfx = audioUtil.addSfx('barrier', game.rnd.integerInRange(0, 2));
  }

  playIntro() {
    this.animations.play('up');

    this.introSfx.play();
  }

  playOutro() {
    this.animations.play('down');
  }
}

module.exports = Barrier;
