var stratusSlider = document.querySelector('.stratus-slider');
var volume = stratusSlider.value;

webpackJsonp([], {
  0: function(a, b, require) {
    var modules = require.c;
    for (var x in modules) {

      if (! modules[x].exports.broadcast) continue;

      modules[x].exports.broadcast('volume:set', (volume / 100));
      break;
    }
  }
});

document.querySelector('.stratus-volume').innerText = volume;
