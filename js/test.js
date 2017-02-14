var stratusInput = document.querySelector('.stratus-input');
var volume = stratusInput.checked? 0.01 : 1.0;

webpackJsonp([], {
  0: function(a, b, require) {
    var modules = require.c;
    for (var x in modules) {
      if (modules[x].exports.broadcast)
        modules[x].exports.broadcast('volume:set', volume);
    }
  }
});
