/* eslint-env browser */
'use strict';

const Player = require('../model/Player');

module.exports = {
  init() {

  },

  preload() {

  },

  create() {
    this.cursors = this.input.keyboard.createCursorKeys();

    this.setupMap();
    this.setupObstacles();
    this.setupPlayer();

    // test
    var phaserJSON = this.cache.getJSON('level1');
    console.log(phaserJSON);
  },

  update() {
    this.player.resetVelocity();

    this.physics.arcade.collide(this.player, this.layer);
    this.physics.arcade.collide(this.player, this.obstacleGroup);

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

  setupPlayer() {
    this.player = new Player(this.game, 30, 0);

    this.player.scale.setTo(.5, .5);

    this.add.existing(this.player);

    this.camera.follow(this.player);
  },

  setupMap() {
    const map = this.add.tilemap('map', 16, 16);

    map.addTilesetImage('tiles');
    map.setCollisionBetween(54, 83);

    this.layer = map.createLayer(0);
    this.layer.resizeWorld();
  },

  setupObstacles() {
    this.obstacleGroup = this.add.group();

    this.input.onUp.add(this.handleMouseUp, this);
  },

  handleMouseUp(pointer) {
    this.addObstacle(pointer.clientX, pointer.clientY);
  },

  addObstacle(x, y) {
    const obstacle = this.makePhysicsSprite(x, y, 'obstacle');

    this.obstacleGroup.add(obstacle);

    obstacle.anchor.set(0.5);

    obstacle.body.moves = false;
  },

  makePhysicsSprite(x, y, asset) {
    const sprite = this.make.sprite(x, y, asset);

    this.physics.enable(sprite, Phaser.Physics.ARCADE);

    return sprite;
  },
};
