var config = {};

config.log = false;

config.webrtc = {"test": {"page": "https://webbrowsertools.com/test-webrtc-leak/"}};

config.welcome = {
  set lastupdate (val) {app.storage.write("lastupdate", val)},
  get lastupdate () {return app.storage.read("lastupdate") !== undefined ? app.storage.read("lastupdate") : 0}
};

config.addon = {
  set state (val) {app.storage.write("state", val)},
  set inject (val) {app.storage.write("inject", val)},
  set webrtc (val) {app.storage.write("webrtc", val)},
  set devices (val) {app.storage.write("devices", val)},
  set additional (val) {app.storage.write("additional", val)},
  get inject () {return app.storage.read("inject") !== undefined ? app.storage.read("inject") : true},
  get state () {return app.storage.read("state") !== undefined ? app.storage.read("state") : "enabled"},
  get devices () {return app.storage.read("devices") !== undefined ? app.storage.read("devices") : false},
  get additional () {return app.storage.read("additional") !== undefined ? app.storage.read("additional") : false},
  get webrtc () {return app.storage.read("webrtc") !== undefined ? app.storage.read("webrtc") : "disable_non_proxied_udp"}
};
