/*
 * Moje TV - double BACK / RETURN shortcut (EXPERIMENTAL)
 * Target: gh/romangazdik-web/mojeTV
 * For TizenTube via TizenBrew on Samsung Tizen 3.x.
 * BACK is a mandatory Samsung key. Do NOT put 'Back' in package.json keys.
 * A single BACK is passed through untouched to YouTube.
 * A second BACK in quick succession returns to Moje TV via TizenBrew.
 * The second key is intercepted; if TV handles key only natively this may not work.
 * ES5 only. TEST VERSION: single Back is expected to work normally; double may vary.
 */
(function () {
  'use strict';
  var HOME = 'gh/romangazdik-web/mojeTV';
  var DOUBLE_MS = 650;
  var lastBackAt = 0;
  var goBusy = false;

  function isBack(e) {
    var c = e.keyCode || e.which;
    return c === 10009 || c === 27 || e.key === 'Back' || e.key === 'Escape';
  }

  function block(e) {
    if (e.preventDefault) e.preventDefault();
    if (e.stopPropagation) e.stopPropagation();
    if (e.stopImmediatePropagation) e.stopImmediatePropagation();
  }

  function gotoHome() {
    if (goBusy) return;
    goBusy = true;
    var socket, done = false;
    var watchdog = setTimeout(function () {
      if (done) return;
      done = true;
      goBusy = false;
      try { socket.close(); } catch (ignored) {}
      if (window.console && console.warn) console.warn('Moje TV: TizenBrew neodpovídá');
    }, 4500);
    try {
      socket = new WebSocket('ws://127.0.0.1:8081');
      socket.onopen = function () {
        socket.send(JSON.stringify({ type: 4, payload: false }));
      };
      socket.onmessage = function (event) {
        var msg, list, i, mod, url;
        if (done) return;
        try { msg = JSON.parse(event.data); } catch (ignored) { return; }
        if (msg.type !== 4 || !msg.payload || Object.prototype.toString.call(msg.payload) !== '[object Array]') return;
        list = msg.payload;
        for (i = 0; i < list.length; i++) {
          if (list[i].fullName === HOME) { mod = list[i]; break; }
        }
        if (!mod) {
          done = true; clearTimeout(watchdog); goBusy = false;
          try { socket.close(); } catch (ignored2) {}
          if (window.console && console.warn) console.warn('Moje TV: cílový modul nebyl nalezen');
          return;
        }
        url = mod.appPath || mod.websiteURL;
        if (!url) {
          done = true; clearTimeout(watchdog); goBusy = false;
          try { socket.close(); } catch (ignored3) {}
          return;
        }
        done = true;
        clearTimeout(watchdog);
        socket.send(JSON.stringify({ type: 5, payload: mod }));
        setTimeout(function () { window.location.href = url; }, 320);
      };
      socket.onerror = function () { goBusy = false; };
    } catch (err) {
      clearTimeout(watchdog);
      goBusy = false;
    }
  }

  function onKeydown(e) {
    if (!isBack(e)) return;
    // Only count physical key presses. Let long-press repeats pass through.
    if (e.repeat) return;
    if (goBusy) return;

    var now = Date.now();
    if (lastBackAt && now - lastBackAt <= DOUBLE_MS) {
      lastBackAt = 0;
      // Only intercept the SECOND key: normal Back always remains functional.
      block(e);
      gotoHome();
      return;
    }

    lastBackAt = now;
    // Intentionally do not block or replay the FIRST Back. It must reach
    // the original YouTube key handler as a genuine, trusted event.
  }

  // Capturing listener sees the key before YouTube, but we do not block a
  // normal single Back. The one exception is the second Back of a double-click.
  window.addEventListener('keydown', onKeydown, true);
}());
