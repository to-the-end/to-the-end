'use strict';

const textUtil = require('../utils/text');

module.exports = {
  init(nextLevelId, cameraPosition) {
    this.nextLevelId    = nextLevelId;
    this.cameraPosition = cameraPosition;
  },

  create() {
    // TODO: Fade this in.
    const overlay = this.add.graphics();

    overlay.beginFill(0x000000, 0.5);
    overlay.drawRect(0, 0, this.world.width, this.world.height);
    overlay.endFill();

    this.camera.x = this.cameraPosition.x;
    this.camera.y = this.cameraPosition.y;

    const retryText = textUtil.addFixedText(
      this.game,
      this.camera.view.width / 2, this.camera.view.height / 2,
      'Try Again',
      { fontSize: 48 }
    );

    retryText.anchor.set(0.5);

    retryText.inputEnabled = true;
    retryText.events.onInputUp.add(function retry() {
      this.closeMenu('level');
    }, this);

    const mainMenuText = textUtil.addFixedText(
      this.game,
      retryText.x, retryText.y + 80,
      'Go to Main Menu',
      { fontSize: 48 }
    );

    mainMenuText.anchor.set(0.5);

    mainMenuText.inputEnabled = true;
    mainMenuText.events.onInputUp.add(function mainMenu() {
      this.closeMenu('main-menu');
    }, this);
  },

  closeMenu(nextState) {
    this.sound.destroy();

    this.state.start(nextState, true, false, this.nextLevelId);
  },
};
