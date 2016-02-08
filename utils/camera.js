'use strict';

module.exports = {
  shake(game, camera, userOptions, callback) {
    const defaultOptions = {
      shakeAxis:          'x', // valid options are 'x', 'y' and 'xy'
      shakeRange:         20,
      shakeInterval:      60,
      shakeCount:         10,
      randomShake:        false,
      randomizeInterval : false,
    };

    const options = Object.assign({}, defaultOptions, userOptions);
    const target = camera.target;

    if (target) {
      camera.unfollow();
    }

    const shakeTimer = game.time.create(false);
    const shakeInterval = options.randomizeInterval ?
      game.rnd.integerInRange(options.shakeInterval, options.shakeInterval * 2) :
      options.shakeInterval;

    shakeTimer.loop(shakeInterval, () => {
      if (options.shakeCount === 0) {
        // if end shake reset camera, stop shake timer and call callback
        if (target) {
          camera.follow(target);
        }

        if (typeof callback === 'function') {
          callback();
        }

        shakeTimer.stop();
        return;
      }

      // Calculate camera shift
      let shiftX;
      let shiftY;
      const shakeRangeHalved = options.shakeRange / 2;

      if (options.randomShake) {
        shiftX = game.rnd.integerInRange(-shakeRangeHalved, shakeRangeHalved);
        shiftY = game.rnd.integerInRange(-shakeRangeHalved, shakeRangeHalved);
      } else {
        shiftX = shiftY = options.shakeCount % 2 ? -shakeRangeHalved : shakeRangeHalved;
      }

      // Shake camera
      if (options.shakeAxis === 'y') {
        game.camera.y += shiftY;
      }

      if (options.shakeAxis === 'x') {
        game.camera.x += shiftX;
      }

      if (options.shakeAxis === 'xy') {
        game.camera.x += shiftX;
        game.camera.y += shiftY;
      }

      options.shakeCount--;
    });

    shakeTimer.start();
  },
};
