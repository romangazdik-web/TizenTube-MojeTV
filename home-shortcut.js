/* Nymind TV 3.0 / TizenTube: non-blocking double BACK navigation.
 * Single BACK is delivered unchanged to YouTube. The second BACK inside 650ms
 * navigates to the Nymind launcher. No synthetic keyboard events, ES5 only.
 */
(function () {
  'use strict';
  var lastBack = 0;
  var HOME = 'https://cdn.jsdelivr.net/gh/romangazdik-web/nyminds-tv@main/app/index.html';
  function back(ev) {
    var code = ev.keyCode || ev.which || 0;
    var key = ev.key || '';
    if (code !== 10009 && code !== 27 && key !== 'BrowserBack' && key !== 'Escape') return;
    var now = Date.now();
    if (lastBack && now - lastBack > 90 && now - lastBack < 650) {
      lastBack = 0;
      try { ev.preventDefault(); ev.stopImmediatePropagation(); } catch (ignore) {}
      try { window.location.replace(HOME); } catch (e) { window.location.href = HOME; }
      return;
    }
    lastBack = now;
    /* Do not block the first press: TizenTube can close menus and playback. */
  }
  if (document && document.addEventListener) document.addEventListener('keydown', back, true);
  window.NymindYoutubeDoubleBack = true;
}());
