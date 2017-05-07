
(function () {
    var unwrapped = new Set(Object.getOwnPropertyNames(window).concat(Object.getOwnPropertyNames(EventTarget.prototype)));
    var proxy = new Proxy(Object.create(null), {
        get: function (target, property, receiver) {
            if (property === Symbol.unscopables)
                return void 0;

            if (!Object.prototype.hasOwnProperty.call(window, property) && !Object.prototype.hasOwnProperty.call(EventTarget.prototype, property))
                return void 0;

            var value = window[property];
            if (unwrapped.delete(property) && typeof value === 'function' && !Object.prototype.hasOwnProperty.call(value, 'prototype'))
                value = window[property] = new Proxy(value, {
                    apply: function (target, thisArg, argumentsList) {
                        return target.apply(thisArg === proxy ? window : thisArg, argumentsList);
                    }
                });

            return value;
        },
        set: function (target, property, value, receiver) {
            window[property] = value;
            unwrapped.delete(property);
        },
        has: function (target, property) {
            return true;
        }
    });
    with (proxy) {

var oneMinuteSignupMessageType={ResetRequestScript:"ResetRequestScript",ResetScript:"ResetScript",LogoutScript:"LogoutScript",UserInformationNeeded:"UserInformationNeeded",NavigateToTab:"NavigateToTab",SaveDiscoveredApps:"SaveDiscoveredApps",Done:"Done",Error:"Error",Log:"Log",SavedToVault:"SavedToVault",GetToken:"GetToken",LaunchApplication:"LaunchApplication",CloseTab:"CloseTab",GetOauthToken:"getOauthToken",ReceivedOauthToken:"token"};chrome.runtime.onMessage.addListener(function(e){e.fromExtension=!0,window.postMessage(e,"https://i2-ui-prod.service.lastpass.com")});var version=0;chrome.runtime.getManifest&&(version=chrome.runtime.getManifest().version),document.body.setAttribute("lastpass-extension-id",chrome.runtime.id||"0"),document.body.setAttribute("lastpass-extension-version",version),window.addEventListener("message",function(e){e.origin===window.location.origin&&function(e){return Object.values(oneMinuteSignupMessageType).indexOf(e)>=0}(e.data.type)&&(e.data.fromExtension||chrome.runtime.sendMessage(e.data,function(e){}))});

    }
})();