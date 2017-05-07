
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

var sendBackground=LPPlatform.requestFrameworkInitializer(function(n){window.postMessage(n,window.location.origin)});window.addEventListener("message",function(n){n.origin!==window.location.origin||!n.data||n.data.cmd&&"Provisioning"!==n.data.cmd[0]||sendBackground(n.data)});

    }
})();