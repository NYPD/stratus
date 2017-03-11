const stratus = (function() {

  let intialize = function() {
    _insertControls();
    _initializeListeners();

    var turnOnStratus = localStorage.getItem('stratusOn') === 'true';
    if(turnOnStratus) {

      var stratusInput = document.querySelector('.stratus-input');
      var changeEvent = new Event('change', {'bubbles': true});
      changeEvent.stratusVolume = localStorage.getItem('stratusVolume');

      stratusInput.checked = true;
      stratusInput.dispatchEvent(changeEvent);
    }
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
    stratusIcon.src = chrome.extension.getURL('images/notext16.png');

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
    let soundcloudVolumeSliderWrapper = soundCloudVolumeDiv.querySelector('.volume__sliderWrapper');

    stratusContainer.addEventListener('click', function(event) {

      var target = event.target;
      var isInput = target.nodeName === 'INPUT';
      if(isInput) return false;

      var clickEvent = new MouseEvent('click', {'bubbles': false});
      stratusInput.dispatchEvent(clickEvent);

      return false;
    });

    stratusInput.addEventListener('change', function(event) {

      localStorage.setItem('stratusOn', stratusInput.checked);

      playControlsVolume.classList.toggle('stratus');

      var stratusNotEnabled = !playControlsVolume.classList.contains('stratus');
      if (stratusNotEnabled) {
        /*
         * Sets the [data-level] to a whole numeber between 0-10 so the correct speaker
         * icon will be displayed in soundcloud when coming out of stratus mode. This actually
         * does not change the actual volume level so the user won't hear a sudden change in volume
         */
        soundCloudVolumeDiv.setAttribute('data-level', Math.ceil(stratusSlider.value / 10));
        return false;
      }

      var hasStratusVolume = event.stratusVolume !== undefined && event.stratusVolume !== null;

      var volumeLevel = hasStratusVolume ? event.stratusVolume : Number.parseFloat(soundcloudVolumeSliderWrapper.getAttribute('aria-valuenow')) * 100;
      stratusSlider.value = volumeLevel;

      var changeEvent = new Event('change', {'bubbles': false });
      stratusSlider.dispatchEvent(changeEvent);

    });

    stratusSlider.addEventListener('change', _stratusSliderEventHandler);
    stratusSlider.addEventListener('input', _stratusSliderEventHandler);
    stratusSlider.addEventListener('mouseout', function () {stratusSlider.blur();});

    soundcloudVolumeButton.addEventListener('click', function(event) {

      var stratusNotEnabled = !playControlsVolume.classList.contains('stratus');
      if (stratusNotEnabled) return true;

      soundcloudVolumeButton.classList.toggle('stratus-muted');

      var isMuted = soundcloudVolumeButton.classList.contains('stratus-muted');
      var volumeLevel = isMuted? 0 : Number.parseFloat(stratusSlider.getAttribute('data-previous-volume'), 10);

      if(isMuted) stratusSlider.setAttribute('data-previous-volume', stratusSlider.value);
      stratusSlider.value = volumeLevel;

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
    script.src = chrome.extension.getURL('js/stratus-inject.js');
    script.className = 'stratus-script';
    (document.head || document.body || document.documentElement).appendChild(script);

  };

  return {
    intialize: intialize
  };

})();

stratus.intialize();
