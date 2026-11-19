/* Moje TV v4 — direct local navigation, no WebSocket from HTTPS YouTube. ES5 for Tizen 3.0. */
(function () {
  'use strict';
  var HOME_URL = 'http://127.0.0.1:8081/module/gh%2Fromangazdik-web%2Fnyminds-tv/app/index.html';
  var LIMIT = 650;
  var lastBack = 0;
  var lastEvent = 0;
  var goingHome = false;
  var display = null;
  var hideTimer = 0;

  function status(message) {
    function paint() {
      if (!document.body) return;
      if (!display) {
        display = document.createElement('div');
        display.id = 'mojetv-nav-v4';
        display.style.cssText = 'position:fixed;z-index:2147483647;top:16px;right:20px;background:#102e4a;color:#fff;padding:9px 13px;border-radius:8px;font:16px Arial,sans-serif;pointer-events:none;';
        document.body.appendChild(display);
      }
      display.style.display = 'block';
      display.textContent = message;
      clearTimeout(hideTimer);
      hideTimer = setTimeout(function () { if (display) display.style.display = 'none'; }, 3200);
    }
    if (document.body) paint();
    else document.addEventListener('DOMContentLoaded', paint);
  }

  function isBack(e) {
    var k = e.keyCode || e.which;
    return k === 10009 || e.key === 'Back' || e.key === 'BrowserBack';
  }

  function goHome() {
    if (goingHome) return;
    goingHome = true;
    status('Nyminds TV: 2x Zpet -> oteviram Nyminds TV');
    setTimeout(function () {
      try {
        // A top-level navigation rather than an insecure WebSocket from https://youtube.com.
        window.location.replace(HOME_URL);
      } catch (err) {
        goingHome = false;
        status('Moje TV v4: navigace odmitnuta');
      }
    }, 100);
    setTimeout(function () {
      if (goingHome) status('Moje TV v4: pokud zustava YouTube, presun je blokovan');
    }, 3300);
  }

  function keydown(e) {
    if (!isBack(e) || e.repeat || goingHome) return;
    var now = Date.now();
    if (now - lastEvent < 85) return; // Ignore accidental duplicate delivery.
    lastEvent = now;
    if (lastBack && now - lastBack <= LIMIT) {
      lastBack = 0;
      if (e.preventDefault) e.preventDefault();
      if (e.stopPropagation) e.stopPropagation();
      if (e.stopImmediatePropagation) e.stopImmediatePropagation();
      goHome();
      return;
    }
    lastBack = now;
    // Single Back is not prevented and not replayed synthetically.
  }

  window.addEventListener('keydown', keydown, true);
  status('Moje TV v4: skript je nacteny');
}());
