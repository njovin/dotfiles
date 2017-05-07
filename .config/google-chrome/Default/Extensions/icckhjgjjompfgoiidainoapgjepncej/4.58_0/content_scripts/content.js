(function() {
  var didStateChange, initIfReady, listener, noop, oldState, wasPlaying;

  if (window.injected) {
    return;
  }

  window.injected = true;

  noop = (function() {});

  window.fireEvent = function(element, event, data) {
    var evt;
    evt = document.createEvent("HTMLEvents");
    evt.initEvent(event, true, true);
    if (data) {
      evt.data = data;
    }
    return !element.dispatchEvent(evt);
  };

  window.innerText = function(id) {
    var _ref;
    return (_ref = document.getElementById(id)) != null ? _ref.textContent : void 0;
  };

  window.clickById = function(id) {
    var div;
    div = document.getElementById(id);
    return fireEvent(div, 'click');
  };

  window.querySelectorText = function(query) {
    var _ref;
    return ((_ref = document.querySelector(query)) != null ? _ref.textContent : void 0) || "";
  };

  window.innerTextById = function(id) {
    var div;
    div = document.getElementById(id);
    return (div != null ? div.textContent : void 0) || "";
  };

  window.hasClassById = function(id, className) {
    var div;
    div = document.getElementById(id);
    return (div != null ? div.classList.contains(className) : void 0) || false;
  };

  window.isVisible = function(el) {
    while (el !== document.body) {
      if (el.style.display === 'none') {
        return false;
      }
      el = el.parentNode;
    }
    return true;
  };

  initIfReady = function() {
    if ((typeof controller !== "undefined" && controller !== null) && controller.init()) {
      return chrome.extension.sendRequest({
        action: "controller_loaded",
        host: window.location.host
      }, noop);
    } else {
      return setTimeout(initIfReady, 500);
    }
  };

  initIfReady();

  wasPlaying = false;

  oldState = null;

  didStateChange = function(newState) {
    var changed, properties, property, _i, _len;
    if (!oldState) {
      oldState = newState;
      return true;
    }
    properties = ['favorite', 'playing', 'thumbsUp', 'thumbsDown', 'title', 'artist', 'albumArt', 'domainIcon'];
    changed = false;
    for (_i = 0, _len = properties.length; _i < _len; _i++) {
      property = properties[_i];
      if (oldState[property] !== newState[property]) {
        changed = true;
        break;
      }
    }
    oldState = newState;
    return changed;
  };

  window.sendState = function(force) {
    var state;
    state = controller.getState();
    state.supports = controller.supports;
    state.action = 'newState';
    state.service = controller.name || document.location.hostname;
    if (!wasPlaying && state.playing) {
      chrome.extension.sendRequest({
        action: 'requestFocus'
      }, noop);
    }
    wasPlaying = state.playing;
    if (didStateChange(state) || force) {
      return chrome.extension.sendRequest(state, noop);
    }
  };

  if (document.querySelector("#plex.application")) {
    chrome.extension.sendRequest({
      action: 'injectController',
      host: "plex"
    }, noop);
  } else {
    chrome.extension.sendRequest({
      action: 'injectController',
      host: window.location.host
    }, noop);
  }

  listener = function(request, sender, sendResponse) {
    if (request.action === "lostFocus") {
      if (controller.lostFocus) {
        controller.lostFocus();
      } else {
        if (request.hostname && request.hostname.indexOf('myspace') !== -1 && document.location.hostname.indexOf('myspace') !== -1) {
          "Do nothing";
        } else {
          if (controller.isPlaying()) {
            controller.play();
          }
        }
      }
    }
    if (request.action === "next") {
      controller.nextSong();
    }
    if (request.action === "thumbsUp" && controller.supports.thumbsUp) {
      controller.thumbsUp();
    }
    if (request.action === "thumbsDown" && controller.supports.thumbsDown) {
      controller.thumbsDown();
    }
    if (request.action === "pause") {
      controller.play();
    }
    if (request.action === "stop" && controller.isPlaying()) {
      controller.play();
    }
    if (request.action === "previous") {
      controller.previousSong();
    }
    if (request.action === "favorite" && controller.supports.favorite) {
      controller.favorite();
    }
    if (request.action === "getState") {
      return sendState(true);
    } else {
      return sendState(false);
    }
  };

  chrome.extension.onRequest.addListener(listener);

}).call(this);
