var volumeSliderWrapper = document.querySelector('.volume__sliderWrapper');
var currentVolume = Number.parseFloat(volumeSliderWrapper.getAttribute('aria-valuenow'), 10);

var stratusInput = document.querySelector('.stratus-input');
var volume = stratusInput.checked? (currentVolume / 2) : currentVolume;

webpackJsonp([], {
  0: function(a, b, require) {
    var modules = require.c;
    for (var x in modules) {
      if (modules[x].exports.broadcast)
        modules[x].exports.broadcast('volume:set', volume);
    }
  }
});
