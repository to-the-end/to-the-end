/* eslint-env browser */

'use strict';

const Player = require('../model/Player');
const Switch = require('../model/Switch');
const Config = require('../config/index');

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

    this.score = 0;

    this.setupMap();
    this.setupObstacles();
    this.setupPlayer();
    this.switchJson = this.cache.getJSON('level1');
    this.order = this.switchJson.order;
    console.log("Switch order: ", this.order);
    this.setupSwitches();
    this.hint(5);
  },

  turnOnNearbySwitches() {
    const threshold = 40;
    const playerX = this.player.x;
    const playerY = this.player.y;

    this.switchGroup.forEach((s) => {
      const distance = Phaser.Math.distance(playerX, playerY, s.x, s.y);

      if (distance < threshold) {
        let switchId = s.flick();
        this.score = s.flick() === this.order[this.score] ? this.score + 1 : 0;
      }
    });
  },

  hint(i) {       
    setTimeout(() => {
      this.order.forEach((id) => {
        this.switchGroup.forEach((s) => {
          if (id === s.getId()) {
            s.on();
            s.off();
          }
        });
      });

      if (--i) this.hint(i);      //  decrement i and call myLoop again if i > 0
    }, 1000)
  },

  update() {
    this.player.resetVelocity();

    this.physics.arcade.collide(this.player, this.collisionLayer);
    this.physics.arcade.collide(this.player, this.obstacleGroup);
    this.physics.arcade.collide(this.player, this.switchGroup);

    var cr = 0;
    if (this.keys.cursors.up.isDown) {
      this.player.walkUp();
      cr++;
    } 
    if (this.keys.cursors.down.isDown) {
      this.player.walkDown();
      cr++;
    } 
    if (this.keys.cursors.left.isDown) {
      this.player.walkLeft();
      cr++;
    } 
    if (this.keys.cursors.right.isDown) {
      this.player.walkRight();
      cr++;
    } 

    if (cr==0){
      this.player.stop();
    }

    if (this.score == this.order.length) {
      console.log("You have completed this level");
      this.add.text(16, 16, 'You have won!', { fontSize: '32px', fill: '#000' });
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
    this.switchGroup = this.add.group();

    let switchId = 1;

    this.switchesLayer
      .getTiles(0, 0, this.world.width, this.world.height)
      .filter((tile) => { return tile.index > 0; })
      .forEach((tile) => {
        let newSwitch = new Switch(this.game, tile.x * tile.width, tile.y * tile.height, switchId++);
        this.switchGroup.add(newSwitch);
      });
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
