/* eslint-env browser */

'use strict';

module.exports = {
  init(sceneId) {
    this.sceneId = sceneId;
  },

  create() {
    this.addUIElements();
    this.enableInteraction();
  },

  addUIElements() {
    const titleStyle = {
      font: 'monospace',
      fontSize: 88,
      fill: '#fff',
      stroke: '#000',
      strokeThickness: 3
    };
    const defaultStyle = {
      font: 'monospace',
      fontSize: 48,
      fill: '#fff',
      stroke: '#000',
      strokeThickness: 3,
    };

    this.title = this.add.text(
      this.camera.view.width / 2, titleStyle.fontSize, 'To The End', titleStyle
    );
    this.title.anchor.set(0.5);

    this.playText = this.add.text(
      this.camera.view.centerX, this.camera.view.centerY,
      'Play', defaultStyle
    );
    this.playText.anchor.set(0.5);

    this.instructionsText = this.add.text(
      this.playText.x, this.playText.y + 80,
      'Instructions', defaultStyle
    );
    this.instructionsText.anchor.set(0.5);
  },

  enableInteraction() {
    this.playText.inputEnabled = true;
    this.playText.events.onInputUp.add(() => {
      this.state.start('scene', true, false, this.sceneId);
    });

    this.instructionsText.inputEnabled = true;
    this.instructionsText.events.onInputUp.add(() => {
      this.showInstructions();
    });
  },

  showInstructions() {
    this.playText.kill();
    this.instructionsText.kill();
    const instructionsStyle = {
      font: 'monospace',
      fontSize: 48,
      fill: '#fff',
      stroke: '#000',
      strokeThickness: 3,
    };
    let instructions = this.add.text(
      this.camera.view.centerX, this.camera.view.centerY, 'Instructions placeholder...', instructionsStyle
    );
    instructions.anchor.set(0.5);
    this.input.onDown.add(function () {
      instructions.destroy();
      this.playText.revive();
      this.instructionsText.revive();
      this.input.onDown.removeAll();
    }, this);
  }
};

