/* eslint-env browser */
'use strict';

let Player = require('../model/Player');

module.exports = {
  init() {

  },

  preload() {

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
    this.player = new Player(this, 0, 0);

    // Follow character
    this.camera.follow(this.player);
    // Create cursor keys
    this.cursors = this.game.input.keyboard.createCursorKeys();

    this.setupObstacles();
  },

  update() {
    this.player.resetVelocity();
    this.game.physics.arcade.collide(this.player, this.layer);
    this.game.physics.arcade.collide(this.player, this.obstacleGroup);

    this.player.body.velocity.set(0);

    if (this.cursors.left.isDown) {
      this.player.walkLeft();
    } else if (this.cursors.right.isDown) {
      this.player.walkRight();
    } else if (this.cursors.up.isDown) {
      this.player.walkUp();
    } else if (this.cursors.down.isDown) {
      this.player.walkDown();
    } else {
      this.player.stop();
    }
  },

  render() {

  },

  setupObstacles() {
    this.obstacleGroup = this.add.group();

    this.obstacleGroup.add(this.makePhysicsSprite(50, 100, 'obstacle'));
  },

  makePhysicsSprite(x, y, asset) {
    const sprite = this.make.sprite(x, y, asset);

    this.physics.enable(sprite, Phaser.Physics.ARCADE);

    return sprite;
  },
};
