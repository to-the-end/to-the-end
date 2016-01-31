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
    let alignH;
    let alignV;

    if (dialogue.position === 'tl') {
      x = 0;
      y = 0;
      anchorX = 0;
      anchorY = 0;
      alignH = 'left';
      alignV = 'top';
    } else if (dialogue.position === 'tr') {
      x = this.camera.view.width;
      y = 0;
      anchorX = 1;
      anchorY = 0;
      alignH = 'right';
      alignV = 'top';
    } else if (dialogue.position === 'bl') {
      x = 0;
      y = this.camera.view.height;
      anchorX = 0;
      anchorY = 1;
      alignH = 'left';
      alignV = 'bottom';
    } else if (dialogue.position === 'br') {
      x = this.camera.view.width;
      y = this.camera.view.height;
      anchorX = 1;
      anchorY = 1;
      alignH = 'right';
      alignV = 'bottom';
    } else {
      x = this.camera.view.width / 2;
      y = this.camera.view.height / 2;
      anchorX = 0.5;
      anchorY = 0.5;
      alignH = 'center';
      alignV = 'center';
    }

    const style = {
      font:     'Raleway',
      fontSize: 24,

      fill: '#fff',

      stroke:          '#000',
      strokeThickness: 3,

      boundsAlignH:  alignH,
      boundsAlignV:  alignV,
      wordWrap:      true,
      wordWrapWidth: this.camera.view.width * 0.6,
    };

    const text = this.add.text(x, y, '', style);

    text.anchor.set(anchorX, anchorY);
    text.fixedToCamera = true;

    this.dialogueGroup.add(text);

    let i = 0;

    this.time.events.repeat(15, dialogue.text.length, function updateText() {
      i++;

      text.setText(dialogue.text.substring(0, i));

      if (i >= dialogue.text.length) {
        this.time.events.add(Phaser.Timer.SECOND * 2.5, function playNext() {
          this.playDialogue(index + 1);
        }, this);
      }
    }, this);
  },

  endScene() {
    this.state.start('main', true, false, this.sceneId);
  },
};
