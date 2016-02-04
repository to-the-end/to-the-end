'use strict';

const config = require('../config');

const Barrier    = require('../objects/barrier');
const Player     = require('../objects/player');
const Switch     = require('../objects/switch');
const audioUtil  = require('../utils/audio');
const cameraUtil = require('../utils/camera');
const textUtil   = require('../utils/text');

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

    this.startIntro();
  },

  setupAudio() {
    this.levelMusic =  this.add.audio('main-soundtrack', 1, true);
    this.levelMusic.play();

    this.puzzleComplete = false;
    this.puzzleCompleteSound = this.add.audio('puzzle-complete-sfx');

    this.switchSounds = audioUtil.buildSfxCollection(this.game, 'switch', 7);
    this.wrongSound = this.add.audio('wrong-sfx');

    this.barrierDestroySounds = audioUtil.buildSfxCollection(this.game, 'barrier-destroy', 1);
    this.barrierDestroySoundIndex = 0;

    this.chainAttachSound = this.add.audio('chain-attach-sfx');
    this.chainDragSounds = audioUtil.buildSfxCollection(this.game, 'chain-drag', 2);
    this.chainDragSoundIndex = 0;
  },

  turnOnNearbySwitches() {
    const threshold = 200;
    const playerX = this.player.x;
    const playerY = this.player.y;

    this.switchGroup.forEachAlive(function maybeFlickSwitch(s) {
      const distance = this.math.distance(playerX, playerY, s.x, s.y);

      if (distance < threshold) {
        const switchId = s.getId();

        const playerChoiceCorrect = this.order[this.score];

        this.score = switchId === playerChoiceCorrect ? this.score + 1 : 0;

        if (this.score === 0) {
          this.wrongSound.play();
          this.showSolution(true);
        } else {
          s.flick();
          s.playSound();
        }
      }
    }, this);
  },

  showSolution(shake) {
    this.disableInput();
    this.player.stop();

    if (shake) {
      cameraUtil.shake(this.game, this.camera, this.showSolution.bind(this));
    } else {
      this.tweenCameraToSwitch(0);
    }
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
    this.physics.arcade.collide(this.player, this.barrierGroup);
    this.physics.arcade.collide(this.player, this.switchGroup);

    if (this.inputEnabled) {
      this.movePlayer();
    } else {
      this.player.stop();
    }

    if (this.score === this.order.length) {
      if (!this.puzzleComplete) {
        this.puzzleComplete = true;
        this.puzzleCompleteSound.play();
      }

      this.endLevel(true);
    }
  },

  preRender() {
    this.updateWorldTint();
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
    this.timerText = textUtil.addFixedText(
      this.game,
      this.camera.view.width / 2, 0,
      `Time left: ${this.levelData.timer}`,
      { fontSize: 24 }
    );

    this.timerText.anchor.set(0.5, 0);
  },

  removeTimerText() {
    this.timerText.destroy();
    this.timerText = null;
  },

  updateTimerText(time) {
    const remainingTime = this.levelData.timer - time;

    this.timerText.setText(`Time left: ${remainingTime}`);
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

    this.add.existing(this.player);

    this.player.canDestroyBarriers = true;
    this.player.scaleCount = 0;

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
        const s = new Switch(
          this.game,
          (tile.x + 0.5) * tile.width, (tile.y + 0.5) * tile.height,
          switchId,
          this.switchSounds[switchId - 1]
        );

        this.switchGroup.add(s);

        switchId++;
      });
  },

  setupObstacles() {
    this.canPlaceBarriers = true;
    this.barrierGroup = this.add.group();
  },

  addObstacleFromPointer(pointer) {
    const tilePoint = new Phaser.Point();

    this.collisionLayer.getTileXY(pointer.worldX, pointer.worldY, tilePoint);

    const tile = this.map.getTile(tilePoint.x, tilePoint.y, 'switches', true);

    const playerX = this.player.body.center.x;
    const playerY = this.player.body.center.y;

    const threshold = 30;
    const distance = this.math.distance(
      playerX, playerY, pointer.worldX, pointer.worldY
    );

    if (!this.isChainActive) {
      if (distance > threshold) {
        if (!this.canPlaceBarriers) {
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

        this.chainAttachSound.play();
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
    const barrier = new Barrier(this.game, x, y);

    if (this.game.physics.arcade.overlap(this.player, barrier)) {
      return;
    }

    barrier.playIntro();

    this.game.time.events.add(Phaser.Timer.SECOND * config.barriers.duration, function() {
      barrier.playOutro();

      this.game.time.events.add(300, barrier.destroy, barrier);
    }, this);

    this.canPlaceBarriers = false;

    this.game.time.events.add(Phaser.Timer.SECOND * config.barriers.cooldown, function() {
      this.canPlaceBarriers = true;
    }, this);

    this.barrierGroup.add(barrier);
  },

  playChainDrag() {
    this.chainDragSounds[this.chainDragSoundIndex].play();
    this.chainDragSoundIndex = (this.chainDragSoundIndex + 1) % 2;
  },

  playBarrierDestroySound() {
    this.barrierDestroySounds[this.barrierDestroySoundIndex].play();
    this.barrierDestroySoundIndex = (this.barrierDestroySoundIndex + 1) % 1;
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

  destroyBarriers() {
    if (!this.player.canDestroyBarriers) {
      return;
    }

    const scaleDelay    = 500;
    const scaleDuration = 250;
    const descaleDelay  = Phaser.Timer.SECOND * config.destruction.scale.duration;

    const threshold = 320;

    this.player.canDestroyBarriers = false;

    this.player.animateCast();

    this.time.events.add(scaleDelay, function scale() {
      const scaleOrigin = this.player.scaleTarget || this.player.scale.x;

      this.player.scaleTarget = Math.min(1 + scaleOrigin, 8 - scaleOrigin);
      this.player.scaleCount++;

      const barriersToDestroy = this.barrierGroup.filter(function(barrier) {
        const distance = this.math.distance(
          this.player.body.center.x, this.player.body.center.y,
          barrier.x, barrier.y
        );

        if (distance < threshold) {
          return true;
        }

        return false;
      }.bind(this));

      this.add.tween(this.player.scale).to(
        {
          x: this.player.scaleTarget,
          y: this.player.scaleTarget,
        },
        scaleDuration,
        Phaser.Easing.LINEAR,
        true
      )
        .onComplete.add(function destroyBarriers() {
          if (barriersToDestroy.total) {
            this.playBarrierDestroySound();
          }

          barriersToDestroy.removeAll(true);

          this.player.canDestroyBarriers = true;

          this.time.events.add(descaleDelay - scaleDuration, function descale() {
            this.player.canDestroyBarriers = false;

            this.player.scaleCount--;

            if (this.player.scaleCount) {
              this.player.canDestroyBarriers = true;
              return;
            }

            this.player.scaleTarget = 1;

            this.add.tween(this.player.scale).to(
              {
                x: this.player.scaleTarget,
                y: this.player.scaleTarget,
              },
              scaleDuration,
              Phaser.Easing.LINEAR,
              true
            )
              .onComplete.add(function enableDestruction() {
                this.player.canDestroyBarriers = true;
              }, this);
          }, this);
        }, this);
    }, this);
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

    const tint = Phaser.Color.interpolateColor(
      0xffffff, 0x555555, 1000, distance, 1
    );

    this.terrainLayer.tint = tint;

    this.barrierGroup.forEachAlive(function updateTint(barrier) {
      barrier.tint = tint;
    });
  },

  startIntro() {
    // TODO: Play an intro cut scene, then do this.
    this.startLevel();
  },

  startLevel() {
    this.addTimerText();

    this.addTimer(function updateTimer(time) {
      this.updateTimerText(time);

      if (time >= this.levelData.timer) {
        this.stopTimer();

        cameraUtil.shake(this.game, this.camera, function endLevel() {
          this.endLevel(false);
        }.bind(this));
      }
    }.bind(this));

    this.startTimer();

    this.showSolution();
  },

  endLevel(success) {
    this.player.stop();

    let id = this.levelId;

    if (!success) {
      const cameraPosition = {
        x: this.camera.x,
        y: this.camera.y,
      };

      this.state.start(
        'level-fail-menu', false, false, id, cameraPosition
      );

      return;
    }

    let state = 'scene';

    id++;

    if (id >= config.level.count) {
      state = 'end';
    }

    this.sound.destroy();

    this.state.start(state, true, false, id);
  },

  enableInput() {
    this.inputEnabled = true;

    this.input.onDown.add(this.addObstacleFromPointer, this);

    // FIXME: Fix this conflict!
    this.keys.spacebar.onDown.add(this.turnOnNearbySwitches, this);
    this.keys.spacebar.onDown.add(this.destroyBarriers, this);

    this.player.enableInput(this.keys.cursors);
  },

  disableInput() {
    this.inputEnabled = false;

    this.input.onDown.removeAll();
    this.keys.spacebar.onDown.removeAll();
    this.player.disableInput(this.keys.cursors);
  },
};
