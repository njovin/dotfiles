(function() {
  var NOTIFY_DELAY, NOTIFY_IDENT, STORAGE_PATH;

  NOTIFY_DELAY = 2000;

  NOTIFY_IDENT = 'song-change';

  STORAGE_PATH = 'notifications-enabled';

  window.setNotificationsEnabled = function(enabled) {
    return localStorage.setItem(STORAGE_PATH, enabled);
  };

  window.isNotificationsEnabled = function() {
    var data;
    data = localStorage.getItem(STORAGE_PATH);
    return data && JSON.parse(data);
  };

  window.notifyJob = {
    schedule: function(id) {
      var notifyCallback;
      notifyCallback = function() {
        window.notifyJob.sent = true;
        return sendAction('getState');
      };
      window.notifyJob.reset();
      window.notifyJob.id = id;
      return window.notifyJob.callbackId = setTimeout(notifyCallback, NOTIFY_DELAY);
    },
    flush: function(options) {
      window.notifyJob.reset();
      return chrome.notifications.create(NOTIFY_IDENT, options);
    },
    reset: function() {
      if (window.notifyJob.callbackId) {
        clearTimeout(window.notifyJob.callbackId);
      }
      window.notifyJob.sent = false;
      window.notifyJob.callbackId = void 0;
      return window.notifyJob.playing = false;
    }
  };

  addStateListener(function(state) {
    var id;
    if (isNotificationsEnabled()) {
      id = state.artist + state.title;
      if ((id !== window.notifyJob.id) || (!window.notifyJob.playing && state.playing)) {
        window.notifyJob.schedule(id);
      } else if (window.notifyJob.sent) {
        window.notifyJob.flush({
          type: 'basic',
          iconUrl: state.albumArt,
          title: state.title,
          message: state.artist
        });
      }
    }
    return window.notifyJob.playing = state.playing;
  });

}).call(this);
