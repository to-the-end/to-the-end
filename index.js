/* eslint-env browser */

'use strict';

const config    = require('./config');
const loadState = require('./states/load');
const mainState = require('./states/main');

document.addEventListener('DOMContentLoaded', function startGame() {
  const game = new Phaser.Game(
    config.game.width,
    config.game.height,
    Phaser.AUTO
  );

  game.state.add('load', loadState);
  game.state.add('main', mainState);

  game.state.start('load');
});
