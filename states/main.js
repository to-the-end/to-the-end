/* eslint-env browser */

'use strict';

const Player = require('../model/Player');
const Switch = require('../model/Switch');

module.exports = {
  init() {

  },

  preload() {

  },

  create() {
    this.isPlayerNextToSwitch = false;
    this.keys = {
      cursors: this.input.keyboard.createCursorKeys(),
      spacebar: this.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR)
    };

    this.keys.spacebar.onDown.add(() => {
      this.turnOnNearbySwitches();
    });

    this.setupMap();
    this.setupObstacles();
    this.setupPlayer();

    // test
    this.switchJson = this.cache.getJSON('level1');
    this.setupSwitches();
  },

  turnOnNearbySwitches() {
    const threshold = 40;
    const playerX = this.player.x;
    const playerY = this.player.y;

    this.switchGroup.forEach((s) => {
      const distance = Phaser.Math.distance(playerX, playerY, s.x, s.y);

      if (distance < threshold) {
        s.flick();
      }
    });
  },

  update() {
    this.player.resetVelocity();

    this.physics.arcade.collide(this.player, this.collisionLayer);
    this.physics.arcade.collide(this.player, this.obstacleGroup);
    this.physics.arcade.collide(this.player, this.switchGroup);

    if (this.keys.cursors.left.isDown) {
      this.player.walkLeft();
    } else if (this.keys.cursors.right.isDown) {
      this.player.walkRight();
    } else if (this.keys.cursors.up.isDown) {
      this.player.walkUp();
    } else if (this.keys.cursors.down.isDown) {
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

    this.switchGroup = this.add.group();
    
    for (var i = 0; i < this.switchJson.switches.length; i++) {
      var tile = this.rnd.pick(tiles);
      let newSwitch = new Switch(this.game, tile.x * tile.width, tile.y * tile.height);  
      this.switchGroup.add(newSwitch);
    }
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
