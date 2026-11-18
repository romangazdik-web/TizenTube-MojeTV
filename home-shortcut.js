/* MojeTV TizenTube nav V3 – diagnostic, ES5, no interception of SINGLE Back. */
(function () {
  'use strict';
  var HOME = 'gh/romangazdik-web/mojeTV';
  var LIMIT = 600, lastBack = 0, busy = false, lastEvent = 0;
  var display = null, hideTimer = 0;
  function status(message) {
    function paint() {
      if (!document.body) return;
      if (!display) {
        display = document.createElement('div');
        display.id = 'moje-tv-nav-v3';
        display.style.cssText = 'position:fixed;z-index:2147483647;top:16px;right:20px;background:#142b46;color:white;padding:9px 13px;border-radius:8px;font:16px Arial,sans-serif;pointer-events:none;';
        document.body.appendChild(display);
      }
      display.style.display = 'block';
      display.textContent = message;
      clearTimeout(hideTimer);
      hideTimer = setTimeout(function(){ if(display) display.style.display='none'; },3200);
    }
    if (document.body) paint(); else document.addEventListener('DOMContentLoaded',paint);
  }
  function isBack(e) {
    var n=e.keyCode || e.which;
    return n === 10009 || e.key === 'Back' || e.key === 'BrowserBack';
  }
  function gotoHome() {
    if (busy) return;
    busy=true;
    status('Moje TV v3: oteviram domovskou obrazovku');
    var sock, finished=false;
    var timeout=setTimeout(function(){ if(finished)return;finished=true;busy=false;try{sock.close()}catch(_){};status('Moje TV v3: spojeni selhalo'); },4500);
    try {
      sock=new WebSocket('ws://127.0.0.1:8081');
      sock.onopen=function(){sock.send(JSON.stringify({type:4,payload:false}));};
      sock.onmessage=function(event){
        if(finished)return;
        var data;try{data=JSON.parse(event.data)}catch(_){return;}
        if(data.type!==4 || Object.prototype.toString.call(data.payload)!=='[object Array]')return;
        var module=null;
        for(var i=0;i<data.payload.length;i++)if(data.payload[i].fullName===HOME){module=data.payload[i];break;}
        if(!module){finished=true;busy=false;clearTimeout(timeout);try{sock.close()}catch(_){};status('Moje TV v3: modul nebyl nalezen');return;}
        var url=module.appPath || module.websiteURL;
        if(!url){finished=true;busy=false;clearTimeout(timeout);try{sock.close()}catch(_){};status('Moje TV v3: chybi URL');return;}
        finished=true;clearTimeout(timeout);
        sock.send(JSON.stringify({type:5,payload:module}));
        setTimeout(function(){window.location.href=url;},320);
      };
      sock.onerror=function(){busy=false;status('Moje TV v3: chyba WebSocket');};
    } catch (_) {busy=false;clearTimeout(timeout);status('Moje TV v3: spojeni nelze otevrit');}
  }
  function keydown(e){
    if(!isBack(e) || e.repeat)return;
    var now=Date.now();
    // Ignore exact duplicate delivery of same key event (not a second press).
    if(now-lastEvent<85)return;
    lastEvent=now;
    if(lastBack && now-lastBack<=LIMIT){
      lastBack=0;
      if(e.preventDefault)e.preventDefault();
      if(e.stopPropagation)e.stopPropagation();
      if(e.stopImmediatePropagation)e.stopImmediatePropagation();
      status('Moje TV v3: 2x Zpet');
      gotoHome();
      return;
    }
    lastBack=now;
    status('Moje TV v3: 1x Zpet – originalni akce');
    // FIRST back is NEVER prevented or synthetically replayed.
  }
  window.addEventListener('keydown',keydown,true);
  status('Moje TV v3: skript je nacteny');
}());
