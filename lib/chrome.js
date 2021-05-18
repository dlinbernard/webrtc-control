var app = {};

app.error = function () {
  return chrome.runtime.lastError;
};

app.shortname = function () {
  return chrome.runtime.getManifest().short_name;
};

app.options = {
  "message": {},
  "receive": function (id, callback) {
    app.options.message[id] = callback;
  },
  "send": function (id, data) {
    chrome.runtime.sendMessage({
      "data": data,
      "method": id,
      "path": "background-to-options"
    });
  }
};

app.contextmenu = {
  "create": function (options, callback) {
    if (chrome.contextMenus) {
      chrome.contextMenus.create(options, function (e) {
        if (callback) callback(e);
      });
    }
  },
  "on": {
    "clicked": function (callback) {
      if (chrome.contextMenus) {
        chrome.contextMenus.onClicked.addListener(function (e) {
          app.storage.load(function () {
            callback(e);
          });
        });
      }
    }
  }
};

app.tab = {
  "query": {
    "index": function (callback) {
      chrome.tabs.query({"active": true, "currentWindow": true}, function (tabs) {
        if (tabs && tabs.length) {
          callback(tabs[0].index);
        } else callback(undefined);
      });
    }
  },
  "open": function (url, index, active, callback) {
    var properties = {
      "url": url, 
      "active": active !== undefined ? active : true
    };
    /*  */
    if (index !== undefined) {
      if (typeof index === "number") {
        properties.index = index + 1;
      }
    }
    /*  */
    chrome.tabs.create(properties, function (tab) {
      if (callback) callback(tab);
    }); 
  }
};

app.privacy = {
  "network": {
    "webrtc": {
      "set": function (options, callback) {
        if (chrome.privacy) {
          if (chrome.privacy.network) {
            if (chrome.privacy.network.webRTCIPHandlingPolicy) {
              chrome.privacy.network.webRTCIPHandlingPolicy.set(options.alpha, function () {
                chrome.privacy.network.webRTCIPHandlingPolicy.get({}, function (e) {
                  if (callback) callback(e);
                });
              });
            }
            /*  */
            if (chrome.privacy.network.webRTCMultipleRoutesEnabled) { // Deprecated since Chrome 48
              chrome.privacy.network.webRTCMultipleRoutesEnabled.set(options.beta, function () {
                chrome.privacy.network.webRTCMultipleRoutesEnabled.get({}, function (e) {
                  if (callback) callback(e);
                });
              });
            }
          }
        }
      }
    }
  }
};

app.on = {
  "management": function (callback) {
    chrome.management.getSelf(callback);
  },
  "uninstalled": function (url) {
    chrome.runtime.setUninstallURL(url, function () {});
  },
  "installed": function (callback) {
    chrome.runtime.onInstalled.addListener(function (e) {
      app.storage.load(function () {
        callback(e);
      });
    });
  },
  "startup": function (callback) {
    chrome.runtime.onStartup.addListener(function (e) {
      app.storage.load(function () {
        callback(e);
      });
    });
  },
  "message": function (callback) {
    chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
      app.storage.load(function () {
        callback(request, sender, sendResponse);
      });
      /*  */
      return true;
    });
  }
};

app.page = {
  "message": {},
  "receive": function (id, callback) {
    app.page.message[id] = callback;
  },
  "send": function (id, data, tabId, frameId) {
    chrome.tabs.query({}, function (tabs) {
      if (tabs && tabs.length) {
        var options = {
          "method": id, 
          "data": data,
          "path": "background-to-page"
        };
        /*  */
        tabs.forEach(function (tab) {
          if (tab) {
            if (tabId !== null) {
              if (tabId === tab.id) {
                if (frameId !== null) {
                  chrome.tabs.sendMessage(tab.id, options, {"frameId": frameId});
                } else {
                  chrome.tabs.sendMessage(tab.id, options);
                }
              }
            } else {
              chrome.tabs.sendMessage(tab.id, options);
            }
          }
        });
      }
    });
  }
};

app.button = {
  "title": function (title, callback) {
    chrome.browserAction.setTitle({"title": title}, function (e) {
      if (callback) callback(e);
    });
  },
  "on": {
    "clicked": function (callback) {
      chrome.browserAction.onClicked.addListener(function (e) {
        app.storage.load(function () {
          callback(e);
        }); 
      });
    }
  },
  "icon": function (path, callback) {
    if (path && typeof path === "object") {
      chrome.browserAction.setIcon({"path": path}, function (e) {
        if (callback) callback(e);
      });
    } else {
      chrome.browserAction.setIcon({
        "path": {
          "16": "../data/icons/" + (path ? path + '/' : '') + "16.png",
          "32": "../data/icons/" + (path ? path + '/' : '') + "32.png",
          "48": "../data/icons/" + (path ? path + '/' : '') + "48.png",
          "64": "../data/icons/" + (path ? path + '/' : '') + "64.png"
        }
      }, function (e) {
        if (callback) callback(e);
      }); 
    }
  }
};

app.storage = (function () {
  chrome.storage.onChanged.addListener(function () {
    chrome.storage.local.get(null, function (e) {
      app.storage.local = e;
      if (app.storage.callback) {
        if (typeof app.storage.callback === "function") {
          app.storage.callback(true);
        }
      }
    });
  });
  /*  */
  return {
    "local": {},
    "callback": null,
    "read": function (id) {
      return app.storage.local[id];
    },
    "on": {
      "changed": function (callback) {
        if (callback) {
          app.storage.callback = callback;
        }
      }
    },
    "write": function (id, data, callback) {
      var tmp = {};
      tmp[id] = data;
      app.storage.local[id] = data;
      chrome.storage.local.set(tmp, function (e) {
        if (callback) callback(e);
      });
    },
    "load": function (callback) {
      var keys = Object.keys(app.storage.local);
      if (keys && keys.length) {
        if (callback) callback("cache");
      } else {
        chrome.storage.local.get(null, function (e) {
          app.storage.local = e;
          if (callback) callback("disk");
        });
      }
    }
  }
})();