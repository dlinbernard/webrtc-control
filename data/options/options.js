var background = (function () {
  var tmp = {};
  chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    for (var id in tmp) {
      if (tmp[id] && (typeof tmp[id] === "function")) {
        if (request.path === "background-to-options") {
          if (request.method === id) tmp[id](request.data);
        }
      }
    }
  });
  /*  */
  return {
    "receive": function (id, callback) {tmp[id] = callback},
    "send": function (id, data) {chrome.runtime.sendMessage({"path": "options-to-background", "method": id, "data": data})}
  }
})();

var config = {
  "render": function (e) {
    var inject = document.querySelector("#inject");
    var devices = document.querySelector("#devices");
    var select = document.querySelector("#method");
    /*  */
    if (e.webrtc) select.value = e.webrtc;
    if (e.inject) inject.checked = e.inject;
    if (e.devices) devices.checked = e.devices;
  },
  "load": function () {
    var test = document.querySelector("#test");
    var inject = document.querySelector("#inject");
    var select = document.querySelector("#method");
    var support = document.querySelector("#support");
    var devices = document.querySelector("#devices");
    var donation = document.querySelector("#donation");
    /*  */
    test.addEventListener("click", function () {background.send("test")});
    support.addEventListener("click", function () {background.send("support")});
    donation.addEventListener("click", function () {background.send("donation")});
    select.addEventListener("change", function (e) {background.send("webrtc", {"webrtc": e.target.value})});
    inject.addEventListener("change", function (e) {background.send("inject", {"inject": e.target.checked})});
    devices.addEventListener("change", function (e) {background.send("devices", {"devices": e.target.checked})});
    /*  */
    background.send("load");
    window.removeEventListener("load", config.load, false);
  }
};

background.receive("storage", config.render);
window.addEventListener("load", config.load, false);
