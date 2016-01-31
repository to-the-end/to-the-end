/* eslint-env browser */

'use strict';

const config     = require('./config');
const endState   = require('./states/end');
const loadState  = require('./states/load');
const mainState  = require('./states/main');
const sceneState = require('./states/scene');

document.addEventListener('DOMContentLoaded', function startGame() {
  const game = new Phaser.Game(
    config.game.width,
    config.game.height,
    Phaser.AUTO
  );

  game.state.add('end',   endState);
  game.state.add('load',  loadState);
  game.state.add('main',  mainState);
  game.state.add('scene', sceneState);

  game.state.start('load');
});
