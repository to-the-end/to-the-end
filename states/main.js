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
    this.setupSwitches();
    this.setupObstacles();
    this.setupPlayer();
  },

  update() {
    this.player.resetVelocity();

    this.physics.arcade.collide(this.player, this.collisionLayer);
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
    this.player = new Player(this.game, 0, 0);

    this.add.existing(this.player);

    this.camera.follow(this.player);
  },

  setupMap() {
    const map = this.add.tilemap('map');

    map.addTilesetImage('main', 'main-tiles');
    map.addTilesetImage('collision', 'collision-tiles');
    map.addTilesetImage('switches', 'switches-tiles');
    map.setCollisionByExclusion([], true, 'collision');

    this.collisionLayer = map.createLayer('collision');
    this.collisionLayer.alpha = 0;

    this.switchesLayer = map.createLayer('switches');
    this.switchesLayer.alpha = 0;

    const layer = map.createLayer('terrain');

    layer.resizeWorld();
  },

  setupSwitches() {
    let tiles = this.switchesLayer.getTiles(0, 0, this.world.width, this.world.height);

    tiles = tiles.filter(function isSwitchTile(tile) {
      return tile.index > 0;
    });

    const tile = this.rnd.pick(tiles);

    this.add.sprite(tile.x * tile.width, tile.y * tile.height, 'switch');
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

  // Accepts values in world coordinates
  getAvailableSpot(width, height, areaX, areaY, areaWidth, areaHeight) {
    let x;
    let y;
    let available = false;
    while (!available) {
      x = this.rnd.integerInRange(areaX, areaX + areaWidth - width);
      y = this.rnd.integerInRange(areaY, areaY + areaHeight - height);
      if (!this.doCollideWithMap(x, y, width, height)) {
        available = true;
      }
    }
    return { x, y };
  },
  
  // Accepts values in world coordinates
  doCollideWithMap(x, y, width, height) {
    let tiles = this.collisionLayer.getTiles(x, y, width, height);
    tiles = tiles.map(tile => tile.index);
    
    let collide = false;
    for (let i = 0; i < tiles.length; i++) {
      if (tile[i] > 0) {
        collide = true;
      }
    }

    return collide;
  }
};
