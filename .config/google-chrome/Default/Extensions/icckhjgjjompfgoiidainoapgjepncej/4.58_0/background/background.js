(function() {
  var activeTab, activeTabStack, handleRequestFromContentScript, handleRequestFromPopup, hasLaunchedOptions, newState, requestFocus, stateListeners, trackActivity, wasPlaying;

  activeTabStack = [];

  activeTab = function() {
    return activeTabStack[activeTabStack.length - 1];
  };

  chrome.tabs.onRemoved.addListener(function(tabId, removeInfo) {
    var index;
    index = activeTabStack.indexOf(tabId);
    if (index !== -1) {
      return activeTabStack.splice(index, 1);
    }
  });

  if (localStorage.getItem('installId') === null) {
    localStorage.setItem("installId", '' + (Math.floor(Math.random() * 100000000000000)));
  }

  trackActivity = function(eventName, attributes) {
    if (attributes == null) {
      attributes = {};
    }
    return attributes.installId = localStorage.getItem('installId');
  };

  chrome.windows.getAll({
    populate: true
  }, function(windows) {
    var cb, tab, tabs, w, _i, _len, _results;
    _results = [];
    for (_i = 0, _len = windows.length; _i < _len; _i++) {
      w = windows[_i];
      tabs = w.tabs;
      _results.push((function() {
        var _j, _len1, _results1;
        _results1 = [];
        for (_j = 0, _len1 = tabs.length; _j < _len1; _j++) {
          tab = tabs[_j];
          if (tab.pinned) {
            continue;
          }
          cb = function() {
            if (chrome.runtime.lastError) {
              return console.log("Last Error", chrome.runtime.lastError);
            }
          };
          _results1.push(chrome.tabs.executeScript(tab.id, {
            file: 'content_scripts/content.js'
          }, cb));
        }
        return _results1;
      })());
    }
    return _results;
  });

  hasLaunchedOptions = localStorage.getItem("hasSeen2");

  if (!hasLaunchedOptions) {
    chrome.tabs.create({
      url: chrome.extension.getURL('options/options.html')
    });
    localStorage.setItem('hasSeen2', true);
  }

  requestFocus = function(newFocusTab) {
    var hostname, index, newid, parser, _ref;
    newid = newFocusTab.id;
    parser = document.createElement('a');
    parser.href = newFocusTab.url;
    hostname = parser.hostname;
    if (activeTab() && activeTab() !== newid) {
      chrome.tabs.sendRequest(activeTab(), {
        action: 'lostFocus',
        hostname: hostname
      }, (function() {}));
    }
    index = activeTabStack.indexOf(newid);
    if (index !== -1) {
      activeTabStack.splice(index, 1);
    }
    activeTabStack.push(newid);
    useMediaKeys();
    return (_ref = window.plugin) != null ? _ref.requestFocus() : void 0;
  };

  window.sendAction = function(action) {
    if (activeTab()) {
      return chrome.tabs.sendRequest(activeTab(), {
        action: action
      }, (function() {}));
    }
  };

  wasPlaying = false;

  stateListeners = [];

  window.addStateListener = function(l) {
    return stateListeners.push(l);
  };

  newState = function(state) {
    var listener, _i, _len, _results;
    if (!wasPlaying && state.playing) {
      useMediaKeys();
    }
    wasPlaying = state.playing;
    _results = [];
    for (_i = 0, _len = stateListeners.length; _i < _len; _i++) {
      listener = stateListeners[_i];
      _results.push(listener(state));
    }
    return _results;
  };

  handleRequestFromContentScript = function(request, sender, sendResponse) {
    var script;
    console.log("REQ", request);
    if (request.action === 'newState' && sender.tab.id === activeTab()) {
      return newState(request);
    } else if (request.action === 'requestFocus') {
      return requestFocus(sender.tab);
    } else if (request.action === 'injectController') {
      script = findScriptByHost(request.host);
      if (!script) {
        return;
      }
      if (script.indexOf('Shim') === -1) {
        trackController(request.host);
      }
      chrome.tabs.executeScript(sender.tab.id, {
        file: script
      });
      if (request.host.indexOf("monstercat") > -1) {
        chrome.tabs.executeScript(sender.tab.id, {
          file: 'controllers/ShimController.js'
        });
      }
      return sendResponse();
    }
  };

  handleRequestFromPopup = function(request, sender, sendResponse) {
    if (request === 'focus') {
      return chrome.tabs.update(activeTab(), {
        selected: true
      });
    } else if (request.action === 'getTabId') {
      return sendResponse({
        tabId: activeTab()
      });
    } else {
      return sendAction(request.action);
    }
  };

  chrome.extension.onRequest.addListener(function(request, sender, sendResponse) {
    if (sender.tab && sender.tab.id !== -1) {
      return handleRequestFromContentScript(request, sender, sendResponse);
    } else {
      return handleRequestFromPopup(request, sender, sendResponse);
    }
  });

  chrome.tabs.onRemoved.addListener(function(tabId, removeInfo) {
    if (tabId === activeTab) {
      return newState({
        playing: false,
        finished: true
      });
    }
  });

}).call(this);
