LPPlatform="undefined"==typeof LPPlatform?{}:LPPlatform,function(e){e.requestFrameworkInitializer=function(){var e=function(e,n){var r=e("",{name:"requestPort"});return r.onMessage.addListener(n),function(e){r.postMessage(e)}};return function(n){return e(chrome.runtime.connect||parent.chrome.runtime.connect,n)}}()}(LPPlatform);