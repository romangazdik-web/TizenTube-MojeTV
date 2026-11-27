/* Nymind TizenTube remote: RED exits intentionally to Nymind TV.
 * BACK remains 100% native. No double-click, no timeouts, no key synthesis.
 * ES5/Chromium 47 compatible; works only if TizenBrew delivers RED.
 */
(function () {
  'use strict';
  var HOME = 'https://cdn.jsdelivr.net/gh/romangazdik-web/nyminds-tv@v3.2.0/app/index.html';
  var leaving = false;
  function onKey(e) {
    var code = e.keyCode || e.which || 0;
    var key = e.key || '';
    if (code !== 403 && key !== 'ColorF0Red') return;
    if (leaving) return;
    leaving = true;
    try { e.preventDefault(); e.stopImmediatePropagation(); } catch (ignore) {}
    try { window.location.replace(HOME); }
    catch (err) { window.location.href = HOME; }
  }
  try {
    if (window.tizen && tizen.tvinputdevice) {
      tizen.tvinputdevice.registerKey('ColorF0Red');
    }
  } catch (ignore) {}
  document.addEventListener('keydown', onKey, true);
  window.NymindYoutubeRedHome = true;
}());
