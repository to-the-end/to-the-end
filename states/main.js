/* eslint-env browser */

'use strict';

module.exports = {
  init() {

  },

  create() {
    // Add map
    let map = this.game.add.tilemap('map', 16, 16);
    map.addTilesetImage('tiles');
    //  This isn't totally accurate, but it'll do for now
    map.setCollisionBetween(54, 83);
    // Create layer
    this.layer = map.createLayer(0);
    this.layer.resizeWorld();
    // Add character
    this.player = this.game.add.sprite(48, 48, 'player', 1);
    this.player.animations.add('left', [8,9], 10, true);
    this.player.animations.add('right', [1,2], 10, true);
    this.player.animations.add('up', [11,12,13], 10, true);
    this.player.animations.add('down', [4,5,6], 10, true);
    // Enable physics on character
    this.game.physics.enable(this.player, Phaser.Physics.ARCADE);
    this.player.body.setSize(10, 14, 2, 1);
    // Follow character
    this.game.camera.follow(this.player);
    // Create cursor keys
    this.cursors = this.game.input.keyboard.createCursorKeys();
  },

  update() {
    this.game.physics.arcade.collide(this.player, this.layer);
    this.player.body.velocity.set(0);

    if (this.cursors.left.isDown) {
      this.player.body.velocity.x = -100;
      this.player.play('left');
    } else if (this.cursors.right.isDown) {
      this.player.body.velocity.x = 100;
      this.player.play('right');
    } else if (this.cursors.up.isDown) {
      this.player.body.velocity.y = -100;
      this.player.play('up');
    } else if (this.cursors.down.isDown) {
      this.player.body.velocity.y = 100;
      this.player.play('down');
    } else {
      this.player.animations.stop();
    }
  },

  render() {

  },
};
