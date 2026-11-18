/*
 * Moje TV - double BACK / RETURN shortcut (EXPERIMENTAL)
 * Target: gh/romangazdik-web/mojeTV
 * For a modified StremioK/TizenBrew module on Samsung Tizen 3.x.
 * BACK is a mandatory Samsung key. Do NOT put 'Back' in package.json keys.
 * A single BACK is delayed ~520 ms, then sent to the active web app.
 * A second BACK within that interval returns to Moje TV via TizenBrew.
 * ES5 only. NOT tested on the user's physical TV.
 */
(function () {
  'use strict';
  var HOME = 'gh/romangazdik-web/mojeTV';
  var DOUBLE_MS = 520;
  var pendingTimer = null;
  var pendingTarget = null;
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

  function syntheticBack(target) {
    // Dispatch a normal keydown for JS-based Back handling after the
    // double-click window. The TV's native/system Back handling cannot be
    // emulated with a synthetic event.
    try {
      var ev = document.createEvent('Event');
      ev.initEvent('keydown', true, true);
      ev.__mojeTvReplayed = true;
      Object.defineProperty(ev, 'keyCode', { get: function () { return 10009; } });
      Object.defineProperty(ev, 'which',   { get: function () { return 10009; } });
      Object.defineProperty(ev, 'key',     { get: function () { return 'Back'; } });
      (target && target.dispatchEvent ? target : document).dispatchEvent(ev);
    } catch (err) {
      // Keep the application alive even if a browser rejects synthetic keys.
      if (window.console && console.warn) console.warn('Moje TV: nelze zopakovat jediné Zpět', err);
    }
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
    if (e.__mojeTvReplayed || !isBack(e)) return;
    // Avoid key-repeat causing repeated double-click actions on long press.
    if (e.repeat) { block(e); return; }
    if (goBusy) { block(e); return; }
    block(e);
    if (pendingTimer !== null) {
      clearTimeout(pendingTimer);
      pendingTimer = null;
      pendingTarget = null;
      gotoHome();
    } else {
      pendingTarget = e.target || document;
      pendingTimer = setTimeout(function () {
        var target = pendingTarget;
        pendingTimer = null;
        pendingTarget = null;
        syntheticBack(target);
      }, DOUBLE_MS);
    }
  }

  // Capture ahead of normal app key handlers, including during playback.
  window.addEventListener('keydown', onKeydown, true);
}());
