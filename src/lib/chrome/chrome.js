'use strict';

var app = {};

app.timer = window;

app.storage = (function () {
  var objs = {};
  chrome.storage.local.get(null, function (o) {
    objs = o;
    document.getElementById("common").src = "../common.js";
  });
  return {
    read : function (id) {return objs[id]},
    write : function (id, data) {
      data = data + '';
      objs[id] = data;
      var tmp = {};
      tmp[id] = data;
      chrome.storage.local.set(tmp, function () {});
    }
  }
})();

app.button = (function () {
  var onCommand;
  chrome.browserAction.onClicked.addListener(function () {
    if (onCommand) {onCommand()}
  });
  return {
    onCommand: function (c) {onCommand = c},
    set icon (obj) {
      chrome.browserAction.setIcon(obj)
    },
    set label (label) {
      chrome.browserAction.setTitle({title: label})
    }
  };
})();

app.tabs = {
  open: function (url) {
    chrome.tabs.create({url: url, active: true});
  }
};

app.version = function () {
  return chrome[chrome.runtime && chrome.runtime.getManifest ? 'runtime' : 'extension'].getManifest().version;
};

app.content_script = {
  send: function (id, data) {
    chrome.tabs.query({}, function (tabs) {
      tabs.forEach(function (tab) {
        chrome.tabs.sendMessage(tab.id, {path: 'background-to-page', method: id, data: data}, function () {});
      });
    });
  },
  receive: function (id, callback) {
    chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
      if (request.path == 'page-to-background') {
        if (request.method === id) {
          callback(request.data);
        }
      }
    });
  }
};

app.webRTC = function (state) {
  if (chrome.privacy.network.webRTCIPHandlingPolicy) {
    if (state === "enabled") {
      chrome.privacy.network.webRTCIPHandlingPolicy.set({value: 'default_public_interface_only'});
    }
    else {
      chrome.privacy.network.webRTCIPHandlingPolicy.set({value: 'default'});
    }
  }
  /*  */
  var webrtc = {value: (state === "disabled")};
  chrome.privacy.network.webRTCMultipleRoutesEnabled.set(webrtc, function() { /* set */
    chrome.privacy.network.webRTCMultipleRoutesEnabled.get({}, function(details) { /* get */
      console.error("WebRTC value: ", details.value); // for debug purpose
    });
  });
}