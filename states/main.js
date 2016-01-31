/* eslint-env browser */

'use strict';

const config = require('../config');

const Player = require('../model/Player');
const Switch = require('../model/Switch');

module.exports = {
  init(levelId) {
    this.levelId = levelId;
  },

  create() {
    this.isChainActive = false;
    this.bombsize = 40;
    this.isPlayerNextToSwitch = false;
    this.keys = {
      cursors:  this.input.keyboard.createCursorKeys(),
      spacebar: this.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR),
    };

    this.score = 0;

    this.setupAudio();

    this.setupMap();
    this.setupObstacles();
    this.setupPlayer();
    this.levelData = this.cache.getJSON(`level-${this.levelId}`);
    this.order = this.levelData.order;
    this.setupSwitches();

    this.addTimerText();
    this.addTimer((timer) => {
      this.updateTimerText(timer);
      // FIXME: instead of levelData we need to change to this.currentLevelJson
      if (timer >= this.levelData.timer) {
        this.stopTimer();

        this.endLevel(false);
      }
    });
    this.startTimer();
    this.showSolution();
  },

  buildSoundCollection(componentName, numberOfAudioClips) {
    const sounds = [];

    for (let x = 0; x < numberOfAudioClips; x++) {
      sounds.push(this.add.audio(componentName + x));
    }

    return sounds;
  },

  setupAudio() {
    this.levelMusic =  this.add.audio('intro', 1, true);
    this.levelMusic.play();
    this.puzzleCompleteSound = this.add.audio('puzzleCompleteMinor');
    this.puzzleComplete = false;
    this.switchSounds = this.buildSoundCollection('switch', 7);
    this.barrierSounds = this.buildSoundCollection('barrier', 3);
    this.barrierSoundIndex = 0;
    this.wrongSound = this.add.audio('wrong');
    this.huaSounds = this.buildSoundCollection('hua',1);
    this.huaSoundIndex = 0;
    this.chainDragSounds = this.buildSoundCollection('chainDrag',2);
    this.chainDragSoundIndex = 0;
    this.chainAttach = this.add.audio('chainAttach');
  },

  turnOnNearbySwitches() {
    const threshold = 80;
    const playerX = this.player.x;
    const playerY = this.player.y;

    this.switchGroup.forEach((s) => {
      const distance = Phaser.Math.distance(playerX, playerY, s.x, s.y);

      if (distance < threshold) {
        let switchId = s.flick();

        const playerChoiceCorrect = this.order[this.score]
        this.score = switchId === playerChoiceCorrect ? this.score + 1 : 0;

        if (this.score === 0) {
          this.wrongSound.play();
          this.showSolution(true);
        } else {
          s.playSound();
        }
      }
    });
  },

  showSolution(shake) {
    this.disableInput();

    if (true) {
      this.shake(() => {
        this.tweenCameraToSwitch(0);
      });
    } else {
      this.tweenCameraToSwitch(0);
    }
  },

  shake(callback) {
    this.camera.unfollow();
    const shakeTimer = this.time.create(false);

    const shakeRange = 20;
    const shakeInterval = 60;
    let shakeCount = 10;

    shakeTimer.loop(shakeInterval, () => {

      if (shakeCount === 0) {
        this.camera.follow(this.player);
        shakeTimer.stop();
        
        if (typeof callback === "function") {
          callback(); 
        }

        return;
      }

      let shift1 = shakeCount % 2 ? -shakeRange / 2 : shakeRange / 2;
      this.camera.x += shift1;

      shakeCount--;

    }, this);

    shakeTimer.start();
  },

  tweenCameraToSwitch(index) {
    const id = this.order[index];

    if (id === undefined) {
      this.tweenCameraToPlayer();

      return;
    }

    const _switch = this.getSwitch(id);

    if (!_switch) {
      return;
    }

    this.camera.unfollow();

    this.tweenCamera(_switch, Phaser.Timer.SECOND * 1.5)
      .onComplete.add(function onComplete() {
        this.pullSwitch(id);

        this.time.events.add(Phaser.Timer.SECOND / 2, function tweenToNext() {
          this.tweenCameraToSwitch(index + 1);
        }, this);
      }.bind(this));
  },

  tweenCameraToPlayer() {
    this.tweenCamera(this.player, 750).onComplete.add(function tweenToNext() {
      this.camera.follow(this.player);
      this.enableInput();
    }.bind(this));
  },

  tweenCamera(target, duration) {
    return this.add.tween(this.camera).to(
      {
        x: target.x - this.camera.width / 2,
        y: target.y - this.camera.height / 2,
      },
      duration,
      Phaser.Easing.Quadratic.InOut,
      true
    );
  },

  getSwitch(id) {
    return this.switchGroup.iterate('id', id, Phaser.Group.RETURN_CHILD);
  },

  pullSwitch(id) {
    const _switch = this.getSwitch(id);

    _switch.on();
    _switch.playSound();
    _switch.off();
  },

  update() {
    this.player.resetVelocity();

    this.physics.arcade.collide(this.player, this.collisionLayer);
    this.physics.arcade.collide(this.player, this.obstacleGroup);
    this.physics.arcade.collide(this.player, this.switchGroup);

    this.updateWorldTint();

    if (this.inputEnabled) {
      this.movePlayer();
    }

    if (this.score === this.order.length) {
      if (!this.puzzleComplete) {
        this.puzzleComplete = true;
        this.puzzleCompleteSound.play();
      }

      this.endLevel(true);
    }
  },

  movePlayer() {
    let hasMoved = false;

    if (this.keys.cursors.left.isDown) {
      this.player.walkLeft();
      hasMoved = true;
    }

    if (this.keys.cursors.right.isDown) {
      this.player.walkRight();
      hasMoved = true;
    }
    
    if (this.keys.cursors.up.isDown) {
      if (hasMoved){
        this.player.body.velocity.y--;
      } else {
        this.player.walkUp();
      }
      hasMoved = true;
    }

    if (this.keys.cursors.down.isDown) {
      if (hasMoved){
        this.player.body.velocity.y++;
      } else {
        this.player.walkDown();
      }
      hasMoved = true;
    }    

    if (hasMoved) {
      this.player.normalizeVelocity();
    } else {
      this.player.stop();
    }

    if (this.isChainActive) {
      const vx = this.player.body.velocity.x;
      const vy = this.player.body.velocity.y;

      const tilePoint = new Phaser.Point();

      this.collisionLayer.getTileXY(this.input.mousePointer.worldX, this.input.mousePointer.worldY, tilePoint);

      const tile = this.map.getTile(tilePoint.x, tilePoint.y, 'switches', true);

      const dirx = tile.worldX - this.player.body.center.x;
      const diry = tile.worldY - this.player.body.center.y;

      const s = this.math.clamp((vx * dirx + vy * diry) / 120000, -0.9, 0);

      this.player.body.velocity.x += vx * s;
      this.player.body.velocity.y += vy * s;
    }
  },

  addTimer(callback) {
    this.timer = this.time.create(false).loop(Phaser.Timer.SECOND * 1, function() {
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
    this.timerText = this.addFloatingText(
      this.camera.view.width / 2, 0, `Time left: ${this.levelData.timer}`, 24
    );
  },

  removeTimerText() {
    this.timerText.destroy();
    this.timerText = null;
  },

  updateTimerText(time) {
    const remainingTime = this.levelData.timer - time;

    this.timerText.setText(`Time left: ${remainingTime}`);
  },

  addFloatingText(x, y, message, fontSize) {
    const style = {
      font:     'monospace',
      fontSize: fontSize || 16,

      fill: '#fff',

      stroke:          '#000',
      strokeThickness: 3,
    };

    const text = this.add.text(x, y, message, style);

    text.fixedToCamera = true;

    return text;
  },

  setupPlayer() {
    let tiles = this.playerLayer.getTiles(
      0, 0, this.world.width, this.world.height
    );

    tiles = tiles.filter(function isValid(tile) {
      return tile.index > 0;
    });

    const tile = this.rnd.pick(tiles);

    this.player = new Player(
      this.game, (tile.x + 0.5) * tile.width,  (tile.y + 0.5) * tile.height
    );

    this.camera.follow(this.player);
    this.camera.update();
  },

  setupMap() {
    this.map = this.add.tilemap(`map-${this.levelId}`);

    this.map.addTilesetImage('terrain', 'terrain-tiles');
    this.map.addTilesetImage('collision', 'collision-tiles');
    this.map.addTilesetImage('switches', 'switches-tiles');
    this.map.addTilesetImage('player', 'player-tiles');
    this.map.setCollisionByExclusion([], true, 'collision');

    this.collisionLayer = this.map.createLayer('collision');
    this.collisionLayer.alpha = 0;

    this.switchesLayer = this.map.createLayer('switches');
    this.switchesLayer.alpha = 0;

    this.playerLayer = this.map.createLayer('player');
    this.playerLayer.alpha = 0;

    this.terrainLayer = this.map.createLayer('terrain');
    this.terrainLayer.resizeWorld();

    const vignette = this.add.filter('Vignette');

    this.world.filters = [ vignette ];
  },

  setupSwitches() {
    this.switchGroup = this.add.group();

    let switchId = 1;

    this.switchesLayer
      .getTiles(0, 0, this.world.width, this.world.height)
      .filter((tile) => { return tile.index > 0; })
      .forEach((tile) => {
        let newSwitch = new Switch(this.game, (tile.x + 0.5) * tile.width, (tile.y + 0.5) * tile.height, switchId, this.switchSounds[switchId - 1]);
        switchId++;
        this.switchGroup.add(newSwitch);
      });
  },

  setupObstacles() {
    this.obstaclesPlaceable = true;
    this.obstacleGroup = this.add.group();
  },

  addObstacleFromPointer(pointer) {
    const tilePoint = new Phaser.Point();

    this.collisionLayer.getTileXY(pointer.worldX, pointer.worldY, tilePoint);

    const tile = this.map.getTile(tilePoint.x, tilePoint.y, 'switches', true);

    const playerX = this.player.body.center.x;
    const playerY = this.player.body.center.y;
    const distance = this.math.distance(playerX, playerY, pointer.worldX, pointer.worldY);
    const threshold = 30;

    if (!this.isChainActive) {
      if (distance > threshold) {
        if (!this.obstaclesPlaceable) {
          return;
        }

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

        this.addBarrier(tile.worldX, tile.worldY);
      } else {
        this.isChainActive = true;

        this.chainAttach.play();
        this.game.time.events.add(Phaser.Timer.SECOND * 0.8, function chainDrag() {
          this.playChainDrag();
        }, this);        

        this.game.time.events.add(Phaser.Timer.SECOND * 2, function deactivateRope() {
          this.isChainActive = false;
          this.chain.destroy();
        }, this);

        const length = 918 / 20;
        const points = [];

        for (let i = 0; i < 20; i++) {
          points.push(new Phaser.Point(i * length, 0));
        }

        this.chain = this.game.add.rope(this.player.body.center.x, this.player.body.center.y, 'chain', null, points);

        const state = this;

        this.chain.updateAnimation = function updateAnimation() {
          const xx = state.player.body.center.x;
          const yy = state.player.body.center.y;

          this.x = xx;
          this.y = yy;

          for (let i = 0; i < this.points.length; i++) {
            const alpha = i / (this.points.length - 1);
            const beta = 1 - alpha;

            this.points[i].x = (state.input.mousePointer.worldX - xx) * beta;
            this.points[i].y = (state.input.mousePointer.worldY - yy) * beta;
          }
        };
      }
    }
  },

  addBarrier(x, y) {
    const obstacle = this.makePhysicsSprite(x, y, 'obstacle');

    if (this.game.physics.arcade.overlap(this.player, obstacle)) {
      return;
    }
    this.shake();
    this.playBarrierSound();

    obstacle.id = Math.round(+new Date() / 1000);
    obstacle.body.moves = false;

    this.game.time.events.add(Phaser.Timer.SECOND * config.obstacles.duration, function() {
      this.removeObstacle(obstacle.id);
    }, this);

    this.obstaclesPlaceable = false;

    this.game.time.events.add(Phaser.Timer.SECOND * config.obstacles.cooldown, function() {
      this.obstaclesPlaceable = true;
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

  playBarrierSound(){
    // Play in sequence
    this.barrierSounds[this.barrierSoundIndex].play();
    this.barrierSoundIndex = (this.barrierSoundIndex + 1) % 3;
  },

  playChainDrag(){
    this.chainDragSounds[this.chainDragSoundIndex].play();
    this.chainDragSoundIndex = (this.chainDragSoundIndex + 1) % 2;
  },
  playHua(){
    this.huaSounds[this.huaSoundIndex].play();
    this.huaSoundIndex = (this.huaSoundIndex + 1) % 1;
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
    const playerX = this.player.body.center.x;
    const playerY = this.player.body.center.y;

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
    if (cr>0){
          this.playHua();
    }

    obstaclesToDestroy.removeAll(true);

    let scaleK = cr * 0.8;

    if (this.player.scale.x + scaleK > 7){
      scaleK = 7 - this.player.scale.x;
    }

    this.add.tween(this.player.scale).to({
      x: this.player.scale.x + scaleK,
      y: this.player.scale.y + scaleK,
    }, 200, Phaser.Easing.LINEAR, true);

    this.game.time.events.add(Phaser.Timer.SECOND * config.obstacles.duration, function() {
      this.add.tween(this.player.scale).to({
        x: this.player.scale.x - scaleK,
        y: this.player.scale.y - scaleK,
      }, 200, Phaser.Easing.LINEAR, true);
    }, this);

    this.player.animateCast();
  },

  updateWorldTint() {
    let distance;

    this.switchGroup.forEachAlive(function getClosest(s) {
      const d = this.math.distance(this.player.x, this.player.y, s.x, s.y);

      if (!distance || d < distance) {
        distance = d;

        return;
      }
    }, this);

    distance = Math.min(Math.round(distance), 999);

    this.terrainLayer.tint = Phaser.Color.interpolateColor(
      0xffffff, 0x555555, 1000, distance, 1
    );
  },

  enableInput() {
    this.inputEnabled = true;

    this.input.onDown.add(this.addObstacleFromPointer, this);

    // FIXME: Fix this conflict!
    this.keys.spacebar.onDown.add(this.turnOnNearbySwitches, this);
    this.keys.spacebar.onDown.add(this.eatWall, this);

    this.player.enableInput(this.keys.cursors);
  },

  disableInput() {
    this.inputEnabled = false;

    this.input.onDown.removeAll();
    this.keys.spacebar.onDown.removeAll();
    this.player.disableInput(this.keys.cursors);
  },

  endLevel(success) {
    let id = this.levelId;

    if (success) {
      id++;
    }

    let state = 'scene';

    if (id > 0) {
      state = 'end';
    }

    this.state.start(state, true, false, id);
  },
};
