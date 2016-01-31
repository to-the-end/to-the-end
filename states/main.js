/* eslint-env browser */

'use strict';

const config = require('../config');

const Player = require('../model/Player');
const Switch = require('../model/Switch');

module.exports = {
  init() {

  },

  preload() {

  },

  create() {
    this.bombsize = 40;
    this.isPlayerNextToSwitch = false;
    this.keys = {
      cursors:  this.input.keyboard.createCursorKeys(),
      spacebar: this.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR),
    };

    this.keys.spacebar.onDown.add(() => {
     this.eatWall();
    });
        
    this.score = 0;

    this.setupMap();
    this.setupObstacles();
    this.setupPlayer();
    this.switchJson = this.cache.getJSON('level1');
    this.order = this.switchJson.order;
    this.setupSwitches();

    this.addTimerText();
    this.addTimer((timer) => {
      this.updateTimerText(timer);
      // FIXME: instead of switchJson we need to change to this.currentLevelJson
      if (timer >= this.switchJson.timer) {
        this.stopTimer();
        // TODO: insert loosing condition here
      }
    });
    this.startTimer();
    this.showSolution();
    this.levelMusic =  this.add.audio('intro', 1, true);
    this.levelMusic.play();
    this.puzzleCompleteSound = this.add.audio('puzzleCompleteMinor');
    this.puzzleComplete = false;
  },

  enableSpaceBarListener() {
    this.keys.spacebar.onDown.add(this.turnOnNearbySwitches, this);
  },

  disableSpaceBarListener() {
    this.keys.spacebar.onDown.remove(this.turnOnNearbySwitches, this);
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

        if (this.score === 0) {
          this.showSolution();
        }
      }
    });
  },

  showSolution() {
    this.disableSpaceBarListener();

    let initialTimeout = 1000;
    let incrementalTimeout = 1000;

    // FIX ME: won't work for ingame pause, use Phaser timer instead
    setTimeout(() => {
      this.order.forEach((id, index) => {
        setTimeout(() => {
          this.pullSwitch(id);

          // if last iteration enable spacebar again
          if (this.order.length === index + 1) {
            this.enableSpaceBarListener();
          }
        }, incrementalTimeout * index);
      });
    }, initialTimeout);
  },

  pullSwitch(id) {
    this.switchGroup.forEach((s) => {
      if (id === s.getId()) {
        s.on();
        s.off();
      }
    });
  },

  update() {
    this.player.resetVelocity();

    this.physics.arcade.collide(this.player, this.collisionLayer);
    this.physics.arcade.collide(this.player, this.obstacleGroup);
    this.physics.arcade.collide(this.player, this.switchGroup);

    let hasMoved = false;

    if (this.keys.cursors.up.isDown) {
      this.player.walkUp();
      hasMoved = true;
    }

    if (this.keys.cursors.down.isDown) {
      this.player.walkDown();
      hasMoved = true;
    }

    if (this.keys.cursors.left.isDown) {
      this.player.walkLeft();
      hasMoved = true;
    }

    if (this.keys.cursors.right.isDown) {
      this.player.walkRight();
      hasMoved = true;
    }

    if (hasMoved) {
      this.player.normalizeVelocity();
    } else {
      this.player.stop();
    }

    if (this.score == this.order.length) {
      if (!this.puzzleComplete){
        this.puzzleComplete = true;
        this.puzzleCompleteSound.play();
      }

      this.add.text(16, 16, 'You have won!', { fontSize: '32px', fill: '#000' });
    }
  },

  render() {

  },

  addTimer(callback) {
    this.timer = this.time.create(false).loop(Phaser.Timer.SECOND * 1, function () {
      callback(this.timer.count);

      this.timer.count++;
    }, this);

    this.timer.count = 0;
  },

  startTimer() {
    this.timer.timer.start();
  },

  stopTimer() {
    this.timer.timer.stop();
  },

  removeTimer() {
    this.time.events.remove(this.timer);
  },

  addTimerText() {
    const style = {
      font:     'monospace',
      fontSize: 16,

      fill: '#fff',

      stroke:          '#000',
      strokeThickness: 3,
    };

    this.timerText = this.add.text(0, 0, 'Time left: 0', style);
    this.timerText.fixedToCamera = true;
  },

  removeTimerText() {
    this.timerText.destroy();
    this.timerText = null;
  },

  updateTimerText(time) {
    this.timerText.setText('Time left: ' + time);
  },

  setupPlayer() {
    this.player = new Player(this.game, this.keys.cursors, this.world.centerX, this.world.centerY);

    this.camera.follow(this.player);
  },

  setupMap() {
    this.map = this.add.tilemap('map');

    this.map.addTilesetImage('terrain', 'terrain-tiles');
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

    this.collisionLayer.getTileXY(pointer.worldX, pointer.worldY, tilePoint);

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

    this.game.time.events.add(Phaser.Timer.SECOND * config.obstacles.timer, function () {
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

  eatWall() {
    const playerX = this.player.x;
    const playerY = this.player.y;

    let cr = 0;

    const obstaclesToDestroy = this.obstacleGroup.filter(function(obstacle) {
      const threshold = 80;
      const distance = Phaser.Math.distance(
        playerX, playerY, obstacle.x, obstacle.y
      );

      if (distance < threshold * 4) {
        cr++;
        return true;
      }

      return false;
    });

    obstaclesToDestroy.removeAll(true);

    const k = 0.8;

    this.player.scale.set(
      this.player.scale.x + cr * k, this.player.scale.y + cr * k
    );
    this.game.time.events.add(Phaser.Timer.SECOND * config.obstacles.timer, function() {
      this.player.scale.set(
        this.player.scale.x - cr * k, this.player.scale.y - cr * k
      );
    }, this);
  },

};
