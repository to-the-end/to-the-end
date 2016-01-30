/* eslint-env browser */

'use strict';

const Player = require('../model/Player');
const Config = require('../config/index');

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

    var cr=0;
    if (this.cursors.up.isDown) {
      this.player.walkUp();
      cr++;
    } 
    if (this.cursors.down.isDown) {
      this.player.walkDown();
      cr++;
    } 
    if (this.cursors.left.isDown) {
      this.player.walkLeft();
      cr++;
    } 
    if (this.cursors.right.isDown) {
      this.player.walkRight();
      cr++;
    } 

    if (cr==0){
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
    this.map = this.add.tilemap('map');

    this.map.addTilesetImage('main', 'main-tiles');
    this.map.addTilesetImage('collision', 'collision-tiles');
    this.map.addTilesetImage('switches', 'switches-tiles');
    this.map.setCollisionByExclusion([], true, 'collision');

    this.collisionLayer = this.map.createLayer('collision');
    this.collisionLayer.alpha = 0;

    this.switchesLayer = this.map.createLayer('switches');
    this.switchesLayer.alpha = 0;

    const layer = this.map.createLayer('terrain');

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

    this.input.onUp.add(this.addObstacleFromPointer, this);
  },

  addObstacleFromPointer(pointer) {
    const tilePoint = new Phaser.Point();

    this.collisionLayer.getTileXY(pointer.clientX, pointer.clientY, tilePoint);

    const tile = this.map.getTile(tilePoint.x, tilePoint.y, 'switches', true);

    // FIXME: This should be a check against existing switches,
    //        not places they could go.
    if (tile.index > 0) {
      return;
    }

    const collides = this.collidesWithMap(
      tile.worldX, tile.worldY, tile.width, tile.height
    );

    if (collides) {
      return;
    }

    this.addObstacle(tile.worldX, tile.worldY);
  },

  addObstacle(x, y) {
    const obstacle = this.makePhysicsSprite(x, y, 'obstacle');
    obstacle.id = Math.round(+new Date()/1000);

    obstacle.body.moves = false;

    this.game.time.events.add(Phaser.Timer.SECOND * Config.obstacles.timer, function () {
      this.removeObstacle(obstacle.id)
    }, this);

    this.obstacleGroup.add(obstacle);
  },

  removeObstacle(id) {
    this.obstacleGroup.forEach((item) => {
      if (item.id === id) {
        item.destroy();
      }
    });
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
      if (!this.collidesWithMap(x, y, width, height)) {
        available = true;
      }
    }
    return { x, y };
  },

  // Accepts values in world coordinates
  collidesWithMap(x, y, width, height) {
    let tiles = this.collisionLayer.getTiles(x, y, width, height);
    tiles = tiles.map(tile => tile.index);

    let collide = false;
    for (let i = 0; i < tiles.length; i++) {
      if (tiles[i] > 0) {
        collide = true;
      }
    }

    return collide;
  },
};
