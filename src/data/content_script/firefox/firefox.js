var background = {
  send: function (id, data) {
    self.port.emit(id, data);
  },
  receive: function (id, callback) {
    self.port.on(id, callback);
  }
};

/* 
  Disable "WebRTC Features" & "WebRTC Media Device Enumeration "
*/

function changeWebRTC(data) {
  if (data.state === "enabled") {
    try {
      if (typeof unsafeWindow.MediaStreamTrack !== "undefined") unsafeWindow.MediaStreamTrack = undefined;
      if (typeof unsafeWindow.RTCPeerConnection !== "undefined") unsafeWindow.RTCPeerConnection = undefined;
      if (typeof unsafeWindow.mozMediaStreamTrack !== "undefined") unsafeWindow.mozMediaStreamTrack = undefined;
      if (typeof unsafeWindow.mozRTCPeerConnection !== "undefined") unsafeWindow.mozRTCPeerConnection = undefined;
      if (typeof unsafeWindow.RTCSessionDescription !== "undefined") unsafeWindow.RTCSessionDescription = undefined;
      if (typeof unsafeWindow.navigator.getUserMedia !== "undefined") unsafeWindow.navigator.getUserMedia = undefined;
      if (typeof unsafeWindow.mozRTCSessionDescription !== "undefined") unsafeWindow.mozRTCSessionDescription = undefined;
      if (typeof unsafeWindow.navigator.mozGetUserMedia !== "undefined") unsafeWindow.navigator.mozGetUserMedia = undefined;
    }
    catch (e) {}
  }
};