var config = {};

/**** wrapper (start) ****/
if (typeof require !== 'undefined') {
  var app = require('./firefox/firefox');
  config = exports;
}
/**** wrapper (end) ****/

config.welcome = {
  get version () {
    return app.storage.read('version');
  },
  set version (val) {
    app.storage.write('version', val);
  },
  url: 'http://mybrowseraddon.com/webrtc-control.html',
  timeout: 3
};

config.addon = {
  get state () { 
    if (!app.storage.read("state") || app.storage.read("state") === 'undefined' || typeof app.storage.read("state") === 'undefined') {   
      return 'enabled';
    }
    else return app.storage.read("state");
  },
  set state (val) {       
    app.storage.write("state", val);
  }
}