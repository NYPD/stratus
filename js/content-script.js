const stratus = (function() {

  let _playControlsVolume = document.querySelector('.playControls__volume');
  let _soundCloudVolumeDiv = _playControlsVolume.querySelector('.volume');
  let _soundcloudVolumeButton = _soundCloudVolumeDiv.querySelector('.volume__button');
  let _soundcloudVolumeSliderWrapper = _soundCloudVolumeDiv.querySelector('.volume__sliderWrapper');
  let _stratusSlider;
  let _stratusVolumeInput;

  let intialize = function() {
    _insertControls();
    _initializeListeners();

    var stratusOff = localStorage.getItem('stratusOn') !== 'true';
    if (stratusOff) return;

    var stratusInput = document.querySelector('.stratus-checkbox');
    var changeEvent = new Event('change', {'bubbles': true});
    changeEvent.stratusVolume = localStorage.getItem('stratusVolume');

    stratusInput.checked = true;
    stratusInput.dispatchEvent(changeEvent);
  };

  let _insertControls = function() {

    //Listener Handle
    let checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.className = 'stratus-checkbox';
    checkbox.title = 'Check to enable stratus';

    let stratusIcon = document.createElement('img');
    stratusIcon.className = 'stratus-icon';
    stratusIcon.src = chrome.extension.getURL('images/notext24.png');

    let divInputContainer = document.createElement('div');
    divInputContainer.className = 'stratus-container';

    divInputContainer.appendChild(stratusIcon);
    divInputContainer.appendChild(checkbox);

    _playControlsVolume.insertAdjacentElement('afterend', divInputContainer);


    //Slider Stuff
    let stratusSlider = document.createElement('input');
    stratusSlider.type = 'range';
    stratusSlider.className = 'stratus-slider';

    let stratusVolumeInput = document.createElement('input');
    stratusVolumeInput.type = 'number';
    stratusVolumeInput.className = 'stratus-volume-input';
    stratusVolumeInput.min = 0;
    stratusVolumeInput.max = 100;

    let stratusSliderContainer = document.createElement('div');
    stratusSliderContainer.className = 'stratus-slider-container';

    stratusSliderContainer.appendChild(stratusSlider);
    stratusSliderContainer.appendChild(stratusVolumeInput);

    _playControlsVolume.querySelector('.volume').insertAdjacentElement('beforeend', stratusSliderContainer);

  };

  let _initializeListeners = function() {

    let stratusContainer = document.querySelector('.stratus-container');
    let stratusCheckbox = document.querySelector('.stratus-checkbox');
    _stratusVolumeInput = document.querySelector('.stratus-volume-input');
    _stratusSlider = document.querySelector('.stratus-slider');

    stratusContainer.addEventListener('click', function(event) {

      var target = event.target;
      var isInput = target.nodeName === 'INPUT';
      if (isInput) return false;

      var clickEvent = new MouseEvent('click', {'bubbles': false});
      stratusCheckbox.dispatchEvent(clickEvent);

      return false;
    });

    stratusCheckbox.addEventListener('change', function(event) {

      localStorage.setItem('stratusOn', stratusCheckbox.checked);

      _playControlsVolume.classList.toggle('stratus');

      var stratusNotEnabled = !_playControlsVolume.classList.contains('stratus');
      if (stratusNotEnabled) {
        /*
         * Sets the [data-level] to a whole number between 0-10 so the correct speaker
         * icon will be displayed in soundcloud when coming out of stratus mode. This actually
         * does not change the actual volume level so the user won't hear a sudden change in volume
         */
        _soundCloudVolumeDiv.setAttribute('data-level', Math.ceil(_stratusSlider.value / 10));
        return false;
      }

      var hasStratusVolume = event.stratusVolume !== undefined && event.stratusVolume !== null;

      var volumeLevel = hasStratusVolume ? event.stratusVolume : Number.parseFloat(_soundcloudVolumeSliderWrapper.getAttribute('aria-valuenow')) * 100;
      _stratusSlider.value = volumeLevel;

      var changeEvent = new Event('change', {'bubbles': false});
      _stratusSlider.dispatchEvent(changeEvent);

    });

    _stratusVolumeInput.addEventListener('change', _stratusVolumeInputEventHandler);
    _stratusVolumeInput.addEventListener('mouseup', _stratusVolumeInputEventHandler);

    _stratusSlider.addEventListener('change', _stratusSliderEventHandler); //Normal change event
    _stratusSlider.addEventListener('input', _stratusSliderEventHandler); //Range sliding event
    _stratusSlider.addEventListener('mouseout', function() {
      _stratusSlider.blur();
    });

    _soundcloudVolumeButton.addEventListener('click', function(event) {

      var stratusNotEnabled = !_playControlsVolume.classList.contains('stratus');
      if (stratusNotEnabled) return true;

      _soundcloudVolumeButton.classList.toggle('stratus-muted');

      var isMuted = _soundcloudVolumeButton.classList.contains('stratus-muted');
      var volumeLevel = isMuted ? 0 : Number.parseFloat(_stratusSlider.getAttribute('data-previous-volume'), 10);

      if (isMuted) _stratusSlider.setAttribute('data-previous-volume', _stratusSlider.value);
      _stratusSlider.value = volumeLevel;

      var changeEvent = new Event('change', {'bubbles': true});
      _stratusSlider.dispatchEvent(changeEvent);

      event.preventDefault();
      event.stopPropagation();
    });

  };

  let _stratusVolumeInputEventHandler = function() {
    _stratusSlider.value = _stratusVolumeInput.value;
    var changeEvent = new Event('change', {'bubbles': false});
    _stratusSlider.dispatchEvent(changeEvent);
  };

  let _stratusSliderEventHandler = function() {

    //'this' is the element this function will be attached to for the event listener
    _soundCloudVolumeDiv.setAttribute('data-stratus-volume', Math.ceil(this.value / 10));

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
