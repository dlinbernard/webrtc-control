var core = {
  "start": function () {
    core.load();
  },
  "install": function () {
    core.load();
  },
  "load": function () {
    core.action.update();
    /*  */
    app.contextmenu.create({
      "contexts": ["action"],
      "title": "Test WebRTC Leak",  
      "id": "webrtc-control-contextmenu-id"
    }, app.error);
  },
  "action": {
    "storage": function (changes, namespace) {
      /*  */
    },
    "contextmenu": function () {
      app.tab.open(config.webrtc.test.page);
    },
    "button": function () {
      const state = config.addon.state;
      config.addon.state = state === "disabled" ? "enabled" : "disabled";
      config.addon.state = config.addon.webrtc === "default" ? "disabled" : config.addon.state;
      /*  */
      core.action.update();
    },
    "page": {
      "load": function (e) {
        app.page.send("storage", {
          "state": config.addon.state,
          "inject": config.addon.inject,
          "devices": config.addon.devices,
          "additional": config.addon.additional
        }, e ? e.tabId : '', e ? e.frameId : '');
      }
    },
    "update": function () {
      app.button.icon(null, config.addon.state);
      app.button.title(null, "WebRTC leak protection is " + (config.addon.state === "enabled" ? "ON" : "OFF"));
      /*  */
      const options = {};
      options.beta = {"scope": "regular", "value": config.addon.state === "disabled"};
      options.alpha = config.addon.state === "enabled" ? {"value": config.addon.webrtc} : {"value": "default"};
      /*  */
      app.privacy.network.webrtc.set(options, function (e) {
        if (config.log) {
          console.error("WebRTC Policy:", e.value);
        }
      });
    },
    "options": {
      "inject": function (e) {
        config.addon.inject = e.inject;
        /*  */
        core.action.update();
      },
      "devices": function (e) {
        config.addon.devices = e.devices;
        /*  */
        core.action.update();
      },
      "additional": function (e) {
        config.addon.additional = e.additional;
        /*  */
        core.action.update();
      },
      "webrtc": function (e) {
        config.addon.webrtc = e.webrtc;
        config.addon.state = config.addon.webrtc === "default" ? "disabled" : "enabled";
        /*  */
        core.action.update();
      },
      "load": function () {
        app.options.send("storage", {
          "webrtc": config.addon.webrtc,
          "inject": config.addon.inject,
          "devices": config.addon.devices,
          "additional": config.addon.additional
        });
      }
    }
  }
};

app.page.receive("load", core.action.page.load);

app.button.on.clicked(core.action.button);
app.contextmenu.on.clicked(core.action.contextmenu);

app.options.receive("load", core.action.options.load);
app.options.receive("inject", core.action.options.inject);
app.options.receive("webrtc", core.action.options.webrtc);
app.options.receive("devices", core.action.options.devices);
app.options.receive("additional", core.action.options.additional);
app.options.receive("support", function () {app.tab.open(app.homepage())});
app.options.receive("test", function () {app.tab.open(config.webrtc.test.page)});
app.options.receive("donation", function () {app.tab.open(app.homepage() + "?reason=support")});

app.on.startup(core.start);
app.on.installed(core.install);
app.on.storage(core.action.storage);
