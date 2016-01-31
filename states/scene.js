/* eslint-env browser */

'use strict';

module.exports = {
  init(sceneId) {
    this.sceneId = sceneId;
  },

  create() {
    this.loadScene(this.sceneId);
    let enter = this.input.keyboard.addKey(13);
    enter.onDown.add(function () {
      this.endScene();
      enter.onDown.removeAll();
    }, this);

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

    let sprite;

    if (dialogue.image) {
      sprite = this.add.sprite(
        this.camera.view.width / 2, this.camera.view.height / 2, dialogue.image
      );

      sprite.anchor.set(0.5);

      const scale = Math.max(
        this.camera.view.width / sprite.width,
        this.camera.view.height / sprite.height
      );

      sprite.scale.set(scale);

      this.dialogueGroup.add(sprite);
    }

    let text;

    if (dialogue.text) {
      const margin = 60;

      let x;
      let y;
      let anchorX;
      let anchorY;
      let alignH;
      let alignV;

      if (dialogue.position === 'tl') {
        x = margin;
        y = margin;
        anchorX = 0;
        anchorY = 0;
        alignH = 'left';
        alignV = 'top';
      } else if (dialogue.position === 'tr') {
        x = this.camera.view.width - margin;
        y = margin;
        anchorX = 1;
        anchorY = 0;
        alignH = 'right';
        alignV = 'top';
      } else if (dialogue.position === 'bl') {
        x = margin;
        y = this.camera.view.height - margin;
        anchorX = 0;
        anchorY = 1;
        alignH = 'left';
        alignV = 'bottom';
      } else if (dialogue.position === 'br') {
        x = this.camera.view.width - margin;
        y = this.camera.view.height - margin;
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

      text = this.add.text(x, y, '', style);

      text.anchor.set(anchorX, anchorY);
      text.fixedToCamera = true;

      this.dialogueGroup.add(text);
    }

    const repetitions = dialogue.text ? dialogue.text.length : 1;

    let i = 0;

    this.time.events.repeat(15, repetitions, function updateText() {
      i++;

      if (text) {
        text.setText(dialogue.text.substring(0, i));
      }

      if (i >= repetitions) {
        this.time.events.add(Phaser.Timer.SECOND * 2, function playNext() {
          this.playDialogue(index + 1);
        }, this);
      }
    }, this);
  },

  endScene() {
    this.state.start('main', true, false, this.sceneId);
  },
};
