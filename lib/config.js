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
  set devices (val) {app.storage.write("devices", val)},
  set webrtc (val) {app.storage.write("webrtc", val)},
  get inject () {return app.storage.read("inject") !== undefined ? app.storage.read("inject") : true},
  get state () {return app.storage.read("state") !== undefined ? app.storage.read("state") : "enabled"},
  get devices () {return app.storage.read("devices") !== undefined ? app.storage.read("devices") : false},
  get webrtc () {return app.storage.read("webrtc") !== undefined ? app.storage.read("webrtc") : "disable_non_proxied_udp"}
};
