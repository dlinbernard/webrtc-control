var background = (function () {
  let tmp = {};
  /*  */
  chrome.runtime.onMessage.addListener(function (request) {
    for (let id in tmp) {
      if (tmp[id] && (typeof tmp[id] === "function")) {
        if (request.path === "background-to-page") {
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
        "path": "page-to-background"
      }, function () {
        return chrome.runtime.lastError;
      });
    }
  }
})();

var config = {
  "update": function (e) {
    if (e.state === "enabled") {
      const script = {};
      /*  */
      if (e.devices) {
        script.a = document.getElementById("webrtc-control-a");
        /*  */
        if (!script.a) {
          script.a = document.createElement("script");
          script.a.type = "text/javascript";
          script.a.setAttribute("id", "webrtc-control-a");
          script.a.onload = function () {script.a.remove()};
          script.a.src = chrome.runtime.getURL("data/content_script/page_context/media_devices.js");
          /*  */
          document.documentElement.appendChild(script.a);
        }
      }
      /*  */
      if (e.inject) {
        script.b = document.getElementById("webrtc-control-b");
        /*  */
        if (!script.b) {
          script.b = document.createElement("script");
          script.b.type = "text/javascript";
          script.b.setAttribute("id", "webrtc-control-b");
          script.b.onload = function () {script.b.remove()};
          script.b.src = chrome.runtime.getURL("data/content_script/page_context/support_detection.js");
          /*  */
          document.documentElement.appendChild(script.b);
        }
      }
      /*  */
      if (e.additional) {
        script.c = document.getElementById("webrtc-control-c");
        /*  */
        if (!script.c) {
          script.c = document.createElement("script");
          script.c.type = "text/javascript";
          script.c.setAttribute("id", "webrtc-control-c");
          script.c.onload = function () {script.c.remove()};
          script.c.src = chrome.runtime.getURL("data/content_script/page_context/additional_objects.js");
          /*  */
          document.documentElement.appendChild(script.c);
        }
      }
    }
  }
};

background.send("load");
background.receive("storage", config.update);
