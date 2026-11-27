/* Nymind TizenTube / RED -> Home.
 * Loaded BEFORE upstream TizenTube, since TizenTube uses RED (403) for Theme Configuration.
 * Capture first at window to avoid triggering the native theme menu.
 * No BACK interception and no double-click shortcut.
 */
(function () {
  'use strict';
  var HOME='https://cdn.jsdelivr.net/gh/romangazdik-web/nyminds-tv@v4.0.1/app/index.html';
  var busy=false;
  function goHome(){
    var ws=null,finished=false,timer=null;
    function direct(){
      if(finished)return;
      finished=true;clearTimeout(timer);
      try{if(ws)ws.close();}catch(e){}
      try{window.location.replace(HOME);}catch(e2){window.location.href=HOME;}
    }
    timer=setTimeout(direct,1600);
    // If TizenBrew's local service is reachable, launch the installed launcher module
    // using the same RPC as Nymind TV itself (preserves module context).
    try{
      ws=new WebSocket('ws://127.0.0.1:8081');
      ws.onopen=function(){ws.send(JSON.stringify({type:4,payload:false}));};
      ws.onmessage=function(ev){
        if(finished)return;
        var msg;try{msg=JSON.parse(ev.data);}catch(e){return;}
        if(msg.type!==4||!msg.payload||Object.prototype.toString.call(msg.payload)!=='[object Array]')return;
        for(var i=0;i<msg.payload.length;i++){
          var m=msg.payload[i],name=(''+(m.fullName||'')+' '+(m.name||'')+' '+(m.appName||'')).toLowerCase();
          if(name.indexOf('nyminds-tv')<0 && name.indexOf('nymind tv')<0)continue;
          var url=m.appPath||m.websiteURL||HOME;
          try{ws.send(JSON.stringify({type:5,payload:m}));}catch(e2){}
          // A short settle gives TizenBrew time to register the module before navigation.
          finished=true;clearTimeout(timer);
          setTimeout(function(){window.location.href=url;},400);
          return;
        }
        direct();
      };
      ws.onerror=direct;
    }catch(e3){direct();}
  }
  function onRemote(e){
    var k=e.keyCode||e.which||0, name=e.key||'';
    if(k!==403 && name!=='ColorF0Red')return;
    // Block keydown, keypress and keyup so TizenTube's RED theme handler never sees them.
    try{e.preventDefault();e.stopPropagation();e.stopImmediatePropagation();}catch(ignore){}
    if(e.type==='keydown' && !busy){busy=true;goHome();}
  }
  try{if(window.tizen&&tizen.tvinputdevice)tizen.tvinputdevice.registerKey('ColorF0Red');}catch(e){}
  window.addEventListener('keydown',onRemote,true);
  window.addEventListener('keypress',onRemote,true);
  window.addEventListener('keyup',onRemote,true);
  window.NymindYoutubeRedHome=true;
}());