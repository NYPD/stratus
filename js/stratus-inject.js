var stratusSlider = document.querySelector('.stratus-slider');
var volume = stratusSlider.value;

localStorage.setItem('stratusVolume', volume);

webpackJsonp([], {
  0: function(a, b, require) {
    var modules = require.c;
    for (var x in modules) {

      if (! modules[x].exports.broadcast) continue;

      modules[x].exports.broadcast('volume', {volume: (volume / 100), muted: false} );
      break;
    }
  }
});

document.querySelector('.stratus-volume').innerText = volume;
