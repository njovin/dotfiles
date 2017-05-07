(function() {
  var activateText, allSet, bkg, checkLoginState, deactivateText, focused, notificationsBox, scrobbler, youtubeBox;

  bkg = chrome.extension.getBackgroundPage();

  scrobbler = bkg.scrobbler;

  activateText = "Scrobble to Last.fm?";

  deactivateText = "Disable Scrobbling";

  checkLoginState = function() {
    var session;
    session = localStorage.getItem("session");
    document.getElementById("lastfm-enable").innerText = session ? deactivateText : activateText;
    if (session) {
      document.getElementById("lastfm-enable").style.display = "";
      return document.getElementById("lastfm-loading").style.display = "none";
    } else {
      document.getElementById("lastfm-enable").style.display = "";
      return document.getElementById("lastfm-loading").style.display = "none";
    }
  };

  document.getElementById("lastfm-enable").addEventListener('click', function() {
    if (bkg.shouldScrobble()) {
      bkg.setShouldScrobble(false);
      document.getElementById("lastfm-enable").innerText = activateText;
      return;
    }
    document.getElementById("lastfm-enable").innerText = deactivateText;
    bkg.setShouldScrobble(true);
    document.getElementById("lastfm-enable").style.display = "none";
    document.getElementById("lastfm-loading").style.display = "";
    return scrobbler.authenticate(checkLoginState);
  });

  document.querySelector(".dogecoin-button").addEventListener('click', function() {
    return alert("Send dogecoin donations to 9zQ9UjtPGoqhwRVAgUmq2wJr8EDMtPK5Ge");
  });

  checkLoginState();

  focused = function() {
    return checkLoginState();
  };

  chrome.tabs.getCurrent(function(tab) {
    var currentTabId;
    currentTabId = tab.id;
    return chrome.tabs.onActiveChanged.addListener(function(tabId) {
      if (tabId === currentTabId) {
        return focused();
      }
    });
  });

  allSet = function() {
    var after, before;
    before = document.querySelector("#before");
    before.style.display = "none";
    after = document.querySelector("#after");
    after.style.display = "";
    return document.querySelector(".alert").classList.add("success");
  };

  youtubeBox = document.querySelector("#ignore-youtube-checkbox");

  if (JSON.parse(localStorage.getItem("ignore-youtube"))) {
    youtubeBox.checked = true;
  }

  youtubeBox.addEventListener("change", function() {
    console.log("CHANGE", youtubeBox.checked);
    return localStorage.setItem("ignore-youtube", JSON.parse(youtubeBox.checked));
  });

  notificationsBox = document.querySelector("#notifications-checkbox");

  notificationsBox.checked = bkg.isNotificationsEnabled();

  notificationsBox.addEventListener("change", function() {
    console.log("CHANGE", notificationsBox.checked);
    return bkg.setNotificationsEnabled(notificationsBox.checked);
  });

}).call(this);
