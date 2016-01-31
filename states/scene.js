/* eslint-env browser */

'use strict';

module.exports = {
  init(sceneId) {
    this.sceneId = sceneId;
  },

  create() {
    this.loadScene(this.sceneId);

    this.dialogueGroup = this.add.group();

    this.playDialogue(0);
  },

  loadScene(id) {
    this.sceneData = this.cache.getJSON(`scene-${id}`);
  },

  playDialogue(index) {
    const style = {
      font:     'monospace',
      fontSize: 24,

      fill: '#fff',

      stroke:          '#000',
      strokeThickness: 3,
    };

    const dialogue = this.sceneData.dialogue[index];

    if (!dialogue) {
      this.endScene();

      return;
    }

    if (dialogue.clear) {
      this.dialogueGroup.removeAll(true);
    }

    let x;
    let y;
    let anchorX;
    let anchorY;

    if (dialogue.position === 'tl') {
      x = 0;
      y = 0;
      anchorX = 0;
      anchorY = 0;
    } else if (dialogue.position === 'tr') {
      x = this.camera.view.width;
      y = 0;
      anchorX = 1;
      anchorY = 0;
    } else if (dialogue.position === 'bl') {
      x = 0;
      y = this.camera.view.height;
      anchorX = 0;
      anchorY = 1;
    } else {
      x = this.camera.view.width;
      y = this.camera.view.height;
      anchorX = 1;
      anchorY = 1;
    }

    const text = this.add.text(x, y, '', style);

    text.anchor.set(anchorX, anchorY);
    text.fixedToCamera = true;

    this.dialogueGroup.add(text);

    let i = 0;

    this.time.events.repeat(10, dialogue.text.length, function updateText() {
      i++;

      text.setText(dialogue.text.substring(0, i));

      if (i >= dialogue.text.length) {
        this.time.events.add(Phaser.Timer.SECOND * 1, function playNext() {
          this.playDialogue(index + 1);
        }, this);
      }
    }, this);
  },

  endScene() {
    this.state.start('main', true, false, this.sceneId);
  },
};
