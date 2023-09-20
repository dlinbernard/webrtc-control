{
  if (typeof navigator.mediaDevices !== "undefined") {
    navigator.mediaDevices = undefined;
  }
  //
  Object.defineProperty(navigator.__proto__,  "mediaDevices", {
    "value": function () {
      return null;
    }
  });
}
