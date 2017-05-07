var sks_qg_security_pwd_bg = "sks_qt";
var sks_fb_accountCount = -1;
function sks_qg_handleLink(sks_qg_index) {//ssks
    localStorage["sks_fb_runmode"] = String(sks_qg_index);
    var sks_qg_url2Load = sks_qg_getCurrentURL();
    chrome.tabs.getSelected(null, function(tb) {
        if (sks_qg_getAlwaysUseCurrentTab()) {
            chrome.tabs.update(tb.id, {
                url: sks_qg_url2Load,
                selected: true
            }, function(tb) {
            });
        }
        else {
            if (tb.url.indexOf('chrome:') > -1 && tb.url.indexOf('newtab') > -1) {
                chrome.tabs.update(tb.id, {
                    url: sks_qg_url2Load,
                    selected: true
                }, function(tb) {
                });
            }
            else {
                chrome.tabs.create({
                    url: sks_qg_url2Load,
                    selected: true
                }, function(tb) {
                });
            }
        }
    });
}

function sks_qg_getAlwaysUseCurrentTab() {
    var ret = false;
    try {
        if (localStorage.getItem('sks_fb_optionsData') != null) {
            var sks_qg_jsonData = jQuery.parseJSON(localStorage["sks_fb_optionsData"]);
            ret = sks_qg_jsonData.curTab == "true" ? true : false;
        }
    }
    catch (Excre) {
        console.log(Excre.message);
    }
    return ret;
}
function sks_qg_getCurrentURL() {//'u' in options represents secure mode
    var sks_qg_url = "https://twitter.com/login/";
    try {
        if (localStorage.getItem('sks_fb_currentURL') != null) {
            sks_qg_url = unescape(localStorage.getItem('sks_fb_currentURL'));
        }
        else {
            var sks_qg_data = getCurrentCredentials();
            if (sks_qg_data == "") {
                return "https://twitter.com/login/";
            }
            var sks_qg_jsonData = jQuery.parseJSON(sks_qg_data);
            sks_qg_url = sks_qg_jsonData.url == "true" ? "https://twitter.com/login/" : "https://twitter.com/login/";
        }
    }
    catch (Exce) {
        console.log(Exce.message);
    }
    return sks_qg_url;
}
chrome.extension.onMessage.addListener(
function(request, sender, sendResponse) {
    if (request.sksmode == "runmode") {
        var sks_qg_runmode = localStorage["sks_fb_runmode"];
        if (!sks_qg_runmode) {
            sendResponse({
                output: "-1"
            });
        }
        else sendResponse({
            output: sks_qg_runmode
        });
    }
    else if (request.sksmode == "resetrunmode") {
        localStorage["sks_fb_runmode"] = "-1";
        sendResponse({});
    }
    else if (request.sksmode == "setrunmode") {
        localStorage["sks_fb_runmode"] = request.runmodedata;
        sendResponse({});
    }
    else if (request.sksmode == "optionsdatamode") {
        var sks_qg_optionsData = localStorage["sks_fb_optionsData"];
        if (!sks_qg_optionsData) {
            sendResponse({
                output: ""
            });
        }
        else sendResponse({
            output: sks_qg_optionsData
        });
    }
    else if (request.sksmode == "saveoptionsdatamode") {
        localStorage["sks_fb_optionsData"] = request.optionsdata;
        sendResponse({
            output: "success"
        });
    }
    else if (request.sksmode == "getcurrentcredentials") {
        var sks_qg_currentCredentials = getCurrentCredentials();
        sendResponse({
            output: sks_qg_currentCredentials
        });
    }
    else if (request.sksmode == "syncsettings") {
        sks_qt_setSyncOption();
        sendResponse({});
    }
    else sendResponse({}); // snub them.
});
function getCurrentCredentials() {
    var outPut = '{ "username" : "", "password": ""}';
    var sks_qg_optionsData = localStorage["sks_fb_optionsData"];
    if (!sks_qg_optionsData) {
        return outPut;
    }
    var sks_qg_runm = localStorage["sks_fb_runmode"];
    if (!sks_qg_runm) {
        return outPut;
    }
    if (sks_qg_runm == "-1") return outPut;
    try {
        var sks_qg_jsonData = jQuery.parseJSON(sks_qg_optionsData);
        outPut = '{ "username" : "' + sks_qg_getProper(sks_qg_jsonData.data[parseInt(sks_qg_runm)].e) + '", "password": "' + sks_qg_decrypt(sks_qg_jsonData.data[parseInt(sks_qg_runm)].p) + '", "url": "' + sks_qg_getProper(sks_qg_jsonData.data[parseInt(sks_qg_runm)].u) + '"}';
    }
    catch (Exc) {
        console.log(Exc.message);
    }
    return outPut;
}
function sks_qg_getProper(sks_qg_arg) {
    if (sks_qg_arg == undefined) {
        return "";
    }
    else {
        return sks_qg_arg;
    }
}
function sks_qg_decrypt(passtext) {
    if (passtext == undefined) {
        return "";
    }
    else if (passtext == "") {
        return "";
    }
    else {
        return AesCtr.decrypt(passtext, sks_qg_security_pwd_bg, 256);
    }
}

function sks_qg_loadOptions() {//ssks
    chrome.tabs.getSelected(null, function(tb) {
        if (tb.url.indexOf('chrome:') > -1 && tb.url.indexOf('newtab') > -1) {
            chrome.tabs.update(tb.id, {
                url: "options.html",
                selected: true
            }, function(tb) { });
        }
        else {
            chrome.tabs.create({
                url: "options.html",
                selected: true
            }, function(tb) { });
        }
    });
}
function sks_qt_setSyncOption() {
    try {
        var sks_qt_settings = sks_qt_getAllSettings();
        chrome.storage.sync.set(sks_qt_settings, function () {
            // Notify that we saved.
        });
    }
    catch (Exss) {
        console.log(Exss.message);
    }
}
function sks_qt_getAllSettings() {
    var sks_qt_sets = {};
    var keyName = '';
    for (var i = 0; i < localStorage.length; i++) {
        keyName = localStorage.key(i);
        sks_qt_sets[keyName] = (localStorage.getItem(localStorage.key(i)).toString() == "" ? '' : localStorage.getItem(localStorage.key(i)));
    }
    return sks_qt_sets;
}
chrome.storage.onChanged.addListener(function (changes, namespace) {
    try {
        for (key in changes) {
            var storageChange = changes[key];
            //console.log('Storage key "%s" in namespace "%s" changed. ' + 'Old value was "%s", new value is "%s".', key, namespace, storageChange.oldValue, storageChange.newValue);
            localStorage.setItem(key, storageChange.newValue);
            //chrome.storage.sync.getBytesInUse(key, function(bytesInUse) { console.log(bytesInUse); });
        }
    }
    catch (Exssl) {
        console.log(Exssl.message);
    }
});