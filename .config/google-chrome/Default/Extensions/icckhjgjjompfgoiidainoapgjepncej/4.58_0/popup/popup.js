(function() {
  var $, bindClickToAction, button, buttons, convertCTAToShare, load, sendRequest, setClass, shouldShow, tabId, updateUI, _i, _len;

  tabId = null;

  $ = function(qs) {
    return document.querySelector(qs);
  };

  sendRequest = function(action) {
    return chrome.extension.sendRequest({
      action: action
    }, (function() {}));
  };

  chrome.extension.sendRequest({
    action: "getTabId"
  }, function(response) {
    return tabId = response.tabId;
  });

  document.addEventListener("keydown", function(e) {
    if (e.keyCode === 32) {
      return sendRequest("pause");
    } else if (e.keyCode === 37) {
      return sendRequest("previous");
    } else if (e.keyCode === 39) {
      return sendRequest("next");
    }
  });

  setClass = function(el, className, show) {
    if (!el) {
      return;
    }
    if (show) {
      return el.classList.add(className);
    } else {
      return el.classList.remove(className);
    }
  };

  shouldShow = function(qs, should) {
    return $(qs).style.display = should ? "block" : "none";
  };

  updateUI = function(uiState) {
    var support;
    $("#song-name").textContent = uiState.title;
    $("#artist-name").textContent = uiState.artist;
    $("#album-art").src = uiState.albumArt || "data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==";
    setClass($("#song-name"), "marquee", $("#song-name").clientWidth > $("#song-name").parentNode.clientWidth);
    setClass($("#artist-name"), "marquee", $("#artist-name").clientWidth > $("#artist-name").parentNode.clientWidth);
    setClass(document.body, "playing", uiState.playing);
    setClass($("#thumbs-up"), "toggled", uiState.thumbsUp);
    setClass($("#thumbs-down"), "toggled", uiState.thumbsDown);
    setClass($("#favorite"), "toggled", uiState.favorite);
    support = uiState.supports;
    shouldShow("#play-pause", support.playpause);
    shouldShow("#next", support.next);
    shouldShow("#previous", support.previous);
    shouldShow("#favorite", support.favorite);
    shouldShow("#thumbs-up", support.thumbsUp);
    shouldShow("#thumbs-down", support.thumbsDown);
    $("#header").classList.remove("no-music");
    $("#not-playing-container").style.display = "none";
    return $("#art-holder").style.display = "";
  };

  chrome.extension.onRequest.addListener(function(request, sender, sendResponse) {
    if (request.action === "requestFocus") {
      tabId = sender.tab.id;
    }
    if (request.action === "newState" && sender.tab && sender.tab.id === tabId) {
      return updateUI(request);
    }
  });

  bindClickToAction = function(divId, action) {
    return $(divId).addEventListener("click", function() {
      return sendRequest(action);
    });
  };

  load = function() {
    bindClickToAction("#thumbs-down", "thumbsDown");
    bindClickToAction("#thumbs-up", "thumbsUp");
    bindClickToAction("#favorite", "favorite");
    bindClickToAction("#previous", "previous");
    bindClickToAction("#play-pause", "pause");
    bindClickToAction("#next", "next");
    bindClickToAction("#song-details", "focus");
    bindClickToAction("#album-art", "focus");
    return document.body.classList.remove("loading");
  };

  document.addEventListener("DOMContentLoaded", load, false);

  convertCTAToShare = function() {
    var html;
    html = 'Share this url: <input id="shareUrl" style="width: 120px; font-size: 15px; height: 20px;" type="text" value="https://chrome.google.com/webstore/detail/swayfm-unified-music-medi/icckhjgjjompfgoiidainoapgjepncej?hl=en-US" /> <a href="http://twitter.com/home?status=Love%20the%20@swayfm%20extension!%20(Play/pause%20streaming%20music%20using%20media%20keys)%20http://goo.gl/8TiDKH" target="_blank"><img class="share-img" src="images/share-buttons/twitter.png"></a> <a href="https://www.facebook.com/sharer.php?s=100&p%5Burl%5D=https%3A%2F%2Fchrome.google.com%2Fwebstore%2Fdetail%2Fswayfm-unified-music-medi%2Ficckhjgjjompfgoiidainoapgjepncej%3Fhl%3Den-US&p%5Bimages%5D%5B0%5D=https%3A%2F%2Flh3.googleusercontent.com%2FY1q2NYND_THaEVgyb--4NedSPUkQjPfV2BpV9FNxQBrk9dnWQMTrBowzBDu1ufqilvtcn8bo%3Dw120-h120&p%5Btitle%5D=Sway.fm%20for%20Chrome&p%5Bsummary%5D=Use%20the%20buttons%20that%20normally%20pause%20iTunes%2C%20to%20play%2Fpause%20any%20music%20playing%20through%20a%20webpage%20in%20Chrome!" target="_blank"><img class="share-img" src="images/share-buttons/facebook.png" /></a> <a href="https://plus.google.com/share?url=https://chrome.google.com/webstore/detail/swayfm-unified-music-medi/icckhjgjjompfgoiidainoapgjepncej?hl=en-US" target="_blank"><img src="images/share-buttons/gplus.png" class="share-img" /></a>';
    $("#sway-cta").innerHTML = html;
    return $("#share-url").focus();
  };

  $("#share-link").onclick = convertCTAToShare;

  sendRequest("getState");

  buttons = document.querySelectorAll(".launch-options");

  for (_i = 0, _len = buttons.length; _i < _len; _i++) {
    button = buttons[_i];
    button.addEventListener('click', function() {
      return chrome.tabs.create({
        url: "options/options.html"
      });
    });
  }

}).call(this);
