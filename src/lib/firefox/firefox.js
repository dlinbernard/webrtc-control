'use strict';

var self            = require('sdk/self'),
    tabs            = require('sdk/tabs'),
    timers          = require('sdk/timers'),
    pageMod         = require('sdk/page-mod'),
    data            = require('sdk/self').data,
    array           = require('sdk/util/array'),
    unload          = require('sdk/system/unload'),
    buttons         = require('sdk/ui/button/action'),
    prefs           = require('sdk/simple-prefs').prefs,
    preferences     = require('sdk/preferences/service'),
    config          = require("../config");

exports.timer = timers;

exports.version = function () {return self.version;};

exports.button = (function () {
  var onClick;
  var button = buttons.ActionButton({
    id: self.name,
    label: 'WebRTC Control',
    icon: {
      '16': './icons/enabled/16.png',
      '32': './icons/enabled/32.png',
      '64': './icons/enabled/64.png'
    },
    onClick: function (e) {
      if (onClick) onClick(e);
    }
  });
  return {
    onCommand: function (c) {
      onClick = c;
    },
    set icon (obj) {
      button.icon = obj;
    },
    set label (label) {
      button.label = label;
    }
  };
})();

exports.storage = {
  read: function (id) {
    return (prefs[id] || prefs[id] + '' === 'false' || !isNaN(prefs[id])) ? (prefs[id] + '') : null;
  },
  write: function (id, data) {
    data = data + '';
    if (data === 'true' || data === 'false') {
      prefs[id] = data === 'true' ? true : false;
    }
    else if (parseInt(data) + '' === data) {
      prefs[id] = parseInt(data);
    }
    else {
      prefs[id] = data + '';
    }
  }
};

exports.content_script = (function () {
  var workers = [], content_script_arr = [];
  pageMod.PageMod({
    include: ['http://*', 'https://*', 'file:///*', 'about:reader?*'],
    contentScriptFile: [
      data.url('content_script/firefox/firefox.js'), 
      data.url('content_script/inject.js')
    ],
    contentScriptWhen: 'start',
    onAttach: function(worker) {
      array.add(workers, worker);
      worker.on('pageshow', function() {array.add(workers, this)});
      worker.on('detach', function() {array.remove(workers, this)});
      worker.on('pagehide', function() {array.remove(workers, this)});
      content_script_arr.forEach(function (arr) {
        worker.port.on(arr[0], arr[1]);
      });
    }
  });
  return {
    send: function (id, data) {
      workers.forEach(function (worker) {
        if (worker) worker.port.emit(id, data);
      });
    },
    receive: function (id, callback) {
      content_script_arr.push([id, callback]);
    }
  }
})();

exports.tabs = {
  open: function (url) {
    tabs.open({url: url, inBackground: false});
  }
};

exports.webRTC = function (state) {
  var value = (state === "disabled");
  preferences.set("media.peerconnection.enabled", value);
  var webRTC = preferences.get("media.peerconnection.enabled");
  //console.error("WebRTC value: ", webRTC); // for debug purpose
}

unload.when(function () {
  preferences.reset("media.peerconnection.enabled");
});