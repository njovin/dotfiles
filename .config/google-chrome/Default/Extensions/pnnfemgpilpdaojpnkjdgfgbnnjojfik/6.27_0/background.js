/**
 * This file acts as a bridge so that content scripts call the chrome extension API's
 *
 * It's also used to implement blocking of certain image requests so that users can use
 * Streak's email tracking features.
 * For more info about this feature, see: https://www.streak.com/email-tracking-in-gmail
 */

'use strict';
/* global chrome, server */

var connectionsByTabId = {};
var globalImageURLwhitelist = [];
var globalImageURLblockers = [];
var EMPTY_IMAGE = {
  redirectUrl: 'data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw=='
};

function setupRequestInterceptor() {
  chrome.webRequest.onBeforeRequest.addListener(
    function(details) {
      // This is so Streak can block email tracking images that were sent by
      // the local user, so that we don't track the user's views of their own
      // emails.

      if (details.method !== "GET") {
        return;
      }

      var connection = connectionsByTabId[details.tabId];

      var imageURLwhitelist = globalImageURLwhitelist.concat(
        connection ? connection.imageURLwhitelist : []
      );
      var imageURLblockers = globalImageURLblockers.concat(
        connection ? connection.imageURLblockers : []
      );

      var shouldBlock = !imageURLwhitelist.some(function(regex) {
        return regex.test(details.url);
      }) && imageURLblockers.some(function(regex) {
        return regex.test(details.url);
      });

      if (!shouldBlock) {
        return;
      }

      if (connection) {
        connection.port.postMessage({
          op: 'blockedImage',
          data: {
            url: details.url
          }
        });
      }

      return EMPTY_IMAGE;
    },
    {
      urls: [
        "*://*.googleusercontent.com/*",
        "*://*.mailfoogae.appspot.com/*"
      ],
      types: ["image"]
    },
    ["blocking"]
  );
}

function deserializeRegExpList(serialized) {
  return serialized.map(function(item) {
    return new RegExp(item.source, item.flags);
  });
}

function loadGlobalBlockers() {
  try {
    var serialized = window.localStorage.getItem('globalBlockers');
    if (!serialized) {
      return;
    }
    var parsed = JSON.parse(serialized);
    globalImageURLwhitelist = deserializeRegExpList(parsed.whitelist);
    globalImageURLblockers = deserializeRegExpList(parsed.blockers);
  } catch (err) {
    console.error("Error loading blockers", err);
  }
}

function saveGlobalBlockers(serializedWhitelist, serializedBlockers) {
  try {
    window.localStorage.setItem('globalBlockers', JSON.stringify({
      timestamp: Date.now(),
      whitelist: serializedWhitelist,
      blockers: serializedBlockers
    }));
  } catch (err) {
    console.error("Error saving blockers", err);
  }
}

var portResponders = {
  extensionListRequest: {
    legacyResponseName: "extensionListResponse",
    handler: function() {
      return new Promise(function(resolve, reject) {
        chrome.management.getAll(function(list) {
          resolve(list);
        });
      });
    }
  },
  installAppIdRequest: {
    legacyResponseName: "installAppIdResponse",
    handler: function() {
      return new Promise(function(resolve, reject) {
        chrome.cookies.get({
          url: server, name: "installAppId"
        }, function(cookie) {
          resolve({value: cookie && cookie.value});
        });
      });
    }
  },
  backgroundFunction: {
    legacyResponseName: "backgroundFunctionResponse",
    handler: function(data) {
      return new Promise(function(resolve, reject) {
        if (data && data.functionPath) {
          callBackgroundFunction(
            data.functionPath,
            (data.args || []).concat(function(result) {
              resolve({
                functionPath: data.functionPath,
                args: data.args,
                result: result
              });
            })
          );
        } else {
          reject(new Error("Bad arguments"));
        }
      });
    }
  },
  backgroundFunctionWithNoResponse: {
    handler: function(data) {
      if (data && data.functionPath) {
        callBackgroundFunction(data.functionPath, data.args || []);
      } else {
        throw new Error("Bad arguments");
      }
    }
  },
  setImageURLblockers: {
    handler: function(data, connection) {
      if (data.whitelist) {
        connection.imageURLwhitelist = deserializeRegExpList(data.whitelist);
      }
      if (data.blockers) {
        connection.imageURLblockers = deserializeRegExpList(data.blockers);
      }
      if (data.globalWhitelist && data.globalBlockers) {
        // The global blockers are more picky in what they block than the
        // connection-specific blockers, because there's no guarantee that the
        // page will be able to undo the block.
        globalImageURLwhitelist = deserializeRegExpList(data.globalWhitelist);
        globalImageURLblockers = deserializeRegExpList(data.globalBlockers);
        saveGlobalBlockers(data.globalWhitelist, data.globalBlockers);
      }
    }
  },
  "default": {
    handler: function() {
      throw new Error("Unknown op");
    }
  }
};

function callBackgroundFunction(functionPath, args) {
  var path = functionPath.split('.');

  var curr = chrome;
  var prevCurr = null;
  for (var ii = 0; ii < path.length; ii++) {
    prevCurr = curr;
    curr = curr[path[ii]];

    if (!curr) {
      throw new Error("Failed to find path");
    }
  }

  curr.apply(prevCurr, args);
}

function setupPort(port) {
  if (port.name && port.name !== "main") {
    return;
  }

  var connection = {
    port: port,
    imageURLwhitelist: [],
    imageURLblockers: []
  };
  if (connectionsByTabId[port.sender.tab.id]) {
    console.error("tab already has an open connection!");
  }
  connectionsByTabId[port.sender.tab.id] = connection;

  port.onMessage.addListener(function(request) {
    var responder = (Object.prototype.hasOwnProperty.call(portResponders, request.op)) ?
      request.op : 'default';
    Promise.resolve().then(function() {
      return portResponders[responder].handler(request.data, connection);
    }).then(function(response) {
      var message = {id: request.id, data: response};
      if (portResponders[responder].legacyResponseName) {
        // Eventually the combined.js code should just find the response by id,
        // instead of relying on this.
        message.op = portResponders[responder].legacyResponseName;
      }
      port.postMessage(message);
    }, function(error) {
      console.error("Error in portResponder:", error);
      port.postMessage({
        id: request.id,
        error: true,
        message: error && error.message,
        stack: error && error.stack
      });
    });
  });

  port.onDisconnect.addListener(function() {
    connection = null;
    delete connectionsByTabId[port.sender.tab.id];
  });
}

chrome.extension.onConnect.addListener(setupPort);
loadGlobalBlockers();
setupRequestInterceptor();
