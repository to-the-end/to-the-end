'use strict';

class Chain extends Phaser.Rope {

  constructor(game, x, y) {
    super(game, x, y, 'dude', 1, [new Phaser.Point(0,0), new Phaser.Point(50, 50)]);
    game.add.existing(this);
  }

} 

module.exports = Chain;