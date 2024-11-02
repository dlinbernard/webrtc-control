var background = (function () {
  let tmp = {};
  chrome.runtime.onMessage.addListener(function (request) {
    for (let id in tmp) {
      if (tmp[id] && (typeof tmp[id] === "function")) {
        if (request.path === "background-to-options") {
          if (request.method === id) {
            tmp[id](request.data);
          }
        }
      }
    }
  });
  /*  */
  return {
    "receive": function (id, callback) {
      tmp[id] = callback;
    },
    "send": function (id, data) {
      chrome.runtime.sendMessage({
        "method": id, 
        "data": data,
        "path": "options-to-background"
      }, function () {
        return chrome.runtime.lastError;
      });
    }
  }
})();

var config = {
  "render": function (e) {
    const select = document.querySelector("#method");
    const inject = document.querySelector("#inject");
    const devices = document.querySelector("#devices");
    const additional = document.querySelector("#additional");
    /*  */
    if (e.webrtc) select.value = e.webrtc;
    if (e.inject) inject.checked = e.inject;
    if (e.devices) devices.checked = e.devices;
    if (e.additional) additional.checked = e.additional;
  },
  "load": function () {
    const test = document.querySelector("#test");
    const inject = document.querySelector("#inject");
    const select = document.querySelector("#method");
    const support = document.querySelector("#support");
    const devices = document.querySelector("#devices");
    const donation = document.querySelector("#donation");
    const additional = document.querySelector("#additional");
    /*  */
    test.addEventListener("click", function () {background.send("test")});
    support.addEventListener("click", function () {background.send("support")});
    donation.addEventListener("click", function () {background.send("donation")});
    select.addEventListener("change", function (e) {background.send("webrtc", {"webrtc": e.target.value})});
    inject.addEventListener("change", function (e) {background.send("inject", {"inject": e.target.checked})});
    devices.addEventListener("change", function (e) {background.send("devices", {"devices": e.target.checked})});
    additional.addEventListener("change", function (e) {background.send("additional", {"additional": e.target.checked})});
    /*  */
    background.send("load");
    window.removeEventListener("load", config.load, false);
  }
};

background.receive("storage", config.render);

window.addEventListener("load", config.load, false);
