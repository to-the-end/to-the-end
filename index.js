/* eslint-env browser */

'use strict';

const config = require('./config');

const endState           = require('./states/end');
const levelFailMenuState = require('./states/level-fail-menu');
const loadState          = require('./states/load');
const mainState          = require('./states/main');
const mainMenuState      = require('./states/main-menu');
const sceneState         = require('./states/scene');

document.addEventListener('DOMContentLoaded', function startGame() {
  const game = new Phaser.Game(
    config.game.width,
    config.game.height,
    Phaser.AUTO
  );

  game.state.add('load', loadState);

  game.state.add('scene', sceneState);

  game.state.add('main', mainState);

  game.state.add('main-menu',       mainMenuState);
  game.state.add('level-fail-menu', levelFailMenuState);

  game.state.add('end', endState);

  game.state.start('load');
});
