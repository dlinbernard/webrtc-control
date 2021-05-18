var core = {
  "start": function () {
    core.load();
  },
  "install": function () {
    core.load();
  },
  "load": function () {
    core.update();
    /*  */
    app.contextmenu.create({
      "title": "Test WebRTC Leak",  
      "contexts": ["browser_action"],
      "id": app.shortname() + "-contextmenu-id"
    }, app.error);
  },
  "update": function () {
    app.button.icon(config.addon.state);
    app.button.title("WebRTC leak protection is " + (config.addon.state === "enabled" ? "ON" : "OFF"));
    /*  */
    var options = {};
    options.beta = {"scope": "regular", "value": config.addon.state === "disabled"};
    options.alpha = config.addon.state === "enabled" ? {"value": config.addon.webrtc} : {"value": "default"};
    /*  */
    app.privacy.network.webrtc.set(options, function (e) {
      if (config.log) console.error("WebRTC Policy:", e.value);
    });
  }
};

app.contextmenu.on.clicked(function () {
  app.tab.open(config.webrtc.test.page)
});

app.options.receive("inject", function (e) {
  config.addon.inject = e.inject;
  /*  */
  core.update();
});

app.options.receive("devices", function (e) {
  config.addon.devices = e.devices;
  /*  */
  core.update();
});

app.options.receive("webrtc", function (e) {
  config.addon.webrtc = e.webrtc;
  config.addon.state = config.addon.webrtc === "default" ? "disabled" : "enabled";
  /*  */
  core.update();
});

app.options.receive("load", function () {
  app.options.send("storage", {
    "webrtc": config.addon.webrtc,
    "inject": config.addon.inject,
    "devices": config.addon.devices
  });
});

app.page.receive("load", function (e) {
  app.page.send("storage", {
    "state": config.addon.state,
    "inject": config.addon.inject,
    "devices": config.addon.devices
  }, e ? e.tabId : '', e ? e.frameId : '');
});

app.button.on.clicked(function () {
  var state = config.addon.state;
  config.addon.state = state === "disabled" ? "enabled" : "disabled";
  config.addon.state = config.addon.webrtc === "default" ? "disabled" : config.addon.state;
  /*  */
  core.update();
});

app.options.receive("support", function () {app.tab.open(app.homepage())});
app.options.receive("test", function () {app.tab.open(config.webrtc.test.page)});
app.options.receive("donation", function () {app.tab.open(app.homepage() + "?reason=support")});

app.on.startup(core.start);
app.on.installed(core.install);