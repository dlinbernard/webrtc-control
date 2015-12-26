/**** wrapper (start) ****/
if (typeof require !== 'undefined') {
  var config = require('./config');
  var app = require('./firefox/firefox');
}
/**** wrapper (end) ****/

var version = config.welcome.version;
if (app.version() !== version) {
  app.timer.setTimeout(function () {
    app.tabs.open(config.welcome.url + '?v=' + app.version() + (version && version !== 'undefined' ? '&p=' + version + '&type=upgrade' : '&type=install'));
    config.welcome.version = app.version();
  }, config.welcome.timeout * 1000);
}

function setAddonState(state) {
  /* Toolbar Button Action */
  app.button.icon = (typeof require !== 'undefined') ? 
  {
    '16': './icons/' + state + '/16.png',
    '32': './icons/' + state + '/32.png',
    '64': './icons/' + state + '/64.png'
  } : { path: {
    '19': '../../data/icons/' + state + '/19.png',
    '38': '../../data/icons/' + state + '/38.png'
  }};
  /* Toolbar Button Label */
  app.button.label = state === 'enabled' ? 'WebRTC Leak is Blocked' : 'WebRTC Leak is Allowed'
  /* webRTC */
  app.webRTC(state);
}

app.button.onCommand(function () {
  var state = config.addon.state;
  state === 'disabled' ? config.addon.state = 'enabled' : config.addon.state = 'disabled';
  setAddonState(config.addon.state);
});
/*  */
setAddonState(config.addon.state);

/* set in-page webrtc related settings */
app.content_script.receive("webrtc", function () {
  app.content_script.send("webrtc", {state: config.addon.state});
});