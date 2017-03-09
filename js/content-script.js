const stratus = (function() {

  let intialize = function() {
    _insertControls();
    _initializeListeners();
  };

  let _insertControls = function() {

    let playControlsVolume = document.querySelector('.playControls__volume');

    //Listener Handle
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


    //Slider Stuff
    let stratusSlider = document.createElement('input');
    stratusSlider.type = 'range';
    stratusSlider.className = 'stratus-slider';

    let stratusVolumeSpan = document.createElement('span');
    stratusVolumeSpan.className = 'stratus-volume';

    let stratusSliderContainer = document.createElement('div');
    stratusSliderContainer.className = 'stratus-slider-container';

    stratusSliderContainer.appendChild(stratusSlider);
    stratusSliderContainer.appendChild(stratusVolumeSpan);

    playControlsVolume.querySelector('.volume').insertAdjacentElement('beforeend', stratusSliderContainer);

  };

  let _initializeListeners = function() {

    let stratusContainer = document.querySelector('.stratus-container');
    let stratusInput = document.querySelector('.stratus-input');
    let stratusSlider = document.querySelector('.stratus-slider');

    let playControlsVolume = document.querySelector('.playControls__volume');
    let soundCloudVolumeDiv = playControlsVolume.querySelector('.volume');
    let soundcloudVolumeButton = soundCloudVolumeDiv.querySelector('.volume__button');

    stratusContainer.addEventListener('click', function(event) {

      var target = event.target;
      var isInput = target.nodeName === 'INPUT';
      if(isInput) return false;

      var clickEvent = new MouseEvent('click', {'bubbles': false});
      stratusInput.dispatchEvent(clickEvent);

      return false;
    });

    stratusInput.addEventListener('change', function() {

      playControlsVolume.classList.toggle('stratus');

      var stratusNotEnabled = !playControlsVolume.classList.contains('stratus');
      if (stratusNotEnabled) return false;

      var volumeLevel = Number.parseInt(soundCloudVolumeDiv.getAttribute('data-level')) * 10;
      stratusSlider.value = volumeLevel;

      var changeEvent = new Event('change', {'bubbles': false });
      stratusSlider.dispatchEvent(changeEvent);

    });

    stratusSlider.addEventListener('change', _stratusSliderEventHandler);
    stratusSlider.addEventListener('input', _stratusSliderEventHandler);

    soundcloudVolumeButton.addEventListener('click', function(event) {

      var stratusNotEnabled = !playControlsVolume.classList.contains('stratus');

      if (stratusNotEnabled) return true;

      var volumeIsNotMuted = !soundCloudVolumeDiv.classList.contains('muted');

      if(volumeIsNotMuted) return false;

      stratusSlider.value = 0;

      var changeEvent = new Event('change', {'bubbles': true });
      stratusSlider.dispatchEvent(changeEvent);

      event.preventDefault();
      event.stopPropagation();
    });

  };

  let _stratusSliderEventHandler = function() {

    var stratusScript = document.querySelector('.stratus-script');
    if (stratusScript !== null) stratusScript.parentNode.removeChild(stratusScript);

    var script = document.createElement('script');
    script.type = 'text/javascript';
    script.src = chrome.extension.getURL('js/test.js');
    script.className = 'stratus-script';
    (document.head || document.body || document.documentElement).appendChild(script);

  };

  return {
    intialize: intialize
  };

})();

stratus.intialize();
