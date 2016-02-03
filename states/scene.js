/* eslint-env browser */

'use strict';

const textUtil = require('../utils/text');

module.exports = {
  init(sceneId) {
    this.loadScene(sceneId);
  },

  create() {
    this.keys = {
      enter: this.input.keyboard.addKey(Phaser.Keyboard.ENTER),
    };

    this.setupDialogue();
    this.setupAudio();

    this.startScene();
  },

  loadScene(id) {
    this.sceneId   = id;
    this.sceneData = this.cache.getJSON(`scene-${id}`);
  },

  setupDialogue() {
    this.dialogueGroup = this.add.group();
  },

  setupAudio() {
    this.music = this.add.audio('scene-soundtrack');
  },

  startScene() {
    this.music.play();

    this.enableInput();

    this.playDialogue(0);
  },

  endScene() {
    this.music.stop();

    this.state.start('main', true, false, this.sceneId);
  },

  enableInput() {
    // TODO: Add a hint for this binding for a short time at the beginning.
    this.keys.enter.onDown.add(this.endScene, this);
  },

  disableInput() {
    this.keys.enter.onDown.removeAll();
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
    let repetitions = 1;

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
        fontSize:      24,
        boundsAlignH:  alignH,
        boundsAlignV:  alignV,
        wordWrap:      true,
        wordWrapWidth: this.camera.view.width * 0.6,
      };

      text = textUtil.addFixedText(this.game, x, y, '', style);

      text.anchor.set(anchorX, anchorY);

      this.dialogueGroup.add(text);

      repetitions = dialogue.text.length;
    }

    let i = 0;

    // TODO: Pause on punctuation.
    this.time.events.repeat(60, repetitions, function updateText() {
      i++;

      if (text) {
        text.setText(dialogue.text.substring(0, i));
      }

      if (i >= repetitions) {
        this.time.events.add(Phaser.Timer.SECOND * 3, function playNext() {
          this.playDialogue(index + 1);
        }, this);
      }
    }, this);
  },
};
