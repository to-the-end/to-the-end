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
      Math.random() * options.shakeInterval + options.shakeInterval :
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
      let shift1;
      let shift2;
      const shakeRangeHalved = options.shakeRange / 2;

      if (options.randomShake) {
        shift1 = game.rnd.integerInRange(-shakeRangeHalved, shakeRangeHalved);
        shift2 = game.rnd.integerInRange(-shakeRangeHalved, shakeRangeHalved);
      } else {
        shift1 = shift2 = options.shakeCount % 2 ? -shakeRangeHalved : shakeRangeHalved;
      }

      // Shake camera
      if (options.shakeAxis === 'y') {
        game.camera.y += shift2;
      }

      if (options.shakeAxis === 'x') {
        game.camera.x += shift1;
      }

      if (options.shakeAxis === 'xy') {
        game.camera.x += shift1;
        game.camera.y += shift2;
      }

      options.shakeCount--;
    });

    shakeTimer.start();
  },
};
