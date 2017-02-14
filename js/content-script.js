const stratus = (function() {

  let intialize = function () {
    _insertControls();
    _initializeListeners();
  };

  let _insertControls = function() {

    let playControlsVolume = document.querySelector('.playControls__volume');

    let checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.className = 'stratus-input';
    checkbox.title = 'Check to halve Soundcloud\'s output';

    let stratusIcon = document.createElement('img');
    stratusIcon.className = 'stratus-icon';
    stratusIcon.src = chrome.extension.getURL('images/temp.png');

    let divInputContainer = document.createElement('div');
    divInputContainer.className = 'stratus-container';

    divInputContainer.appendChild(stratusIcon);
    divInputContainer.appendChild(checkbox);

    playControlsVolume.insertAdjacentElement('afterend', divInputContainer);

  };

  let _initializeListeners = function () {

    let stratusInput = document.querySelector('.stratus-input');

    stratusInput.addEventListener('change', function() {

      var stratusScript = document.querySelector('.stratus-script');
      if(stratusScript !== null) stratusScript.parentNode.removeChild(stratusScript);

      var script = document.createElement('script');
      script.type = 'text/javascript';
      script.src = chrome.extension.getURL('js/test.js');
      script.className = 'stratus-script';
      (document.head || document.body || document.documentElement).appendChild(script);

    });

  };

  return {
    intialize: intialize
  };

})();

stratus.intialize();
