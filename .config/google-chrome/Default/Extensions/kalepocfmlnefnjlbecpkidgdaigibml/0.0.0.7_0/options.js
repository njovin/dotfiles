$(document).ready(function() {
    sks_qg_load_options();
    $('#div5 a:nth-child(1)').bind('click', function(event) {
        sks_showhide();
        //return false;
        event.stopPropagation();
    });
    $('#sks_qg_btnSave').bind('click', function() {
        sks_qg_save_options(); return false;
        //event.stopPropagation();
    });
    $("input[id^=sks_qg_name]").bind('blur', function() {
        //sks_qg_checkNameValue(this);
    });
});
if (typeof String.prototype.trim !== 'function') {
    String.prototype.trim = function() {
        return this.replace(/^\s+|\s+$/g, '');
    }
}
var sks_qg_maxCount = 10;
var sks_qg_security_pwd = "sks_qt";
function sks_qg_load_options() {
    try {
        var parent = document.getElementById("divControls")
        for (var i = 0; i < sks_qg_maxCount; i++) {
            var j = i + 1;
            var child = document.createElement('div');
            child.setAttribute("class", "eachcontrol");
            child.setAttribute("id", "sks_qg_" + i);
            child.innerHTML = "<span><strong>" + j + ".</strong></span>&nbsp;" + (j < 10 ? "&nbsp;&nbsp;" : "") + "Name:&nbsp;<input id='sks_qg_name" + i + "' type='text' maxlength='25' size='30' />&nbsp;&nbsp;Username or email:&nbsp;<input id='sks_qg__email" + i + "' type='text' maxlength='255' size='35' />&nbsp;&nbsp;Password:&nbsp;<input id='sks_qg_password" + i + "' type='password' maxlength='100' size='25' />";
            parent.appendChild(child);
        }
    }
    catch (Exx) {
        console.log(Exx.message);
    }
    sks_qg_load_values();
    sks_qg_check4Incognito();
}

function sks_qg_save_options() {
    if (sks_qg_validate_options() == false) {
        return;
    }
    var jsonString = '{"data":[';
    for (var i = 0; i < sks_qg_maxCount; i++) {
        jsonString += "{";
        var elem = document.getElementById("sks_qg_" + i).childNodes;
        for (var j = 0; j < elem.length; j++) {
            if (elem[j].type == "text") {
                jsonString += (elem[j].id.indexOf("_name") > 0 ? '"n":' : '"e":') + '"' + elem[j].value + '",';
            }
            else if (elem[j].type == "password") {
                if (elem[j].value.length > 0) {
                    jsonString += '"p":' + '"' + AesCtr.encrypt(elem[j].value, sks_qg_security_pwd, 256) + '",';
                }
                else {
                    jsonString += '"p":' + '"",';
                }
            }
        }
        jsonString = jsonString.substr(0, jsonString.length - 1);
        jsonString += "},";
    }
    jsonString = jsonString.substr(0, jsonString.length - 1);
    jsonString += "],";
    jsonString += '"curTab":' + '"' + (document.getElementById("chkCurrentTab").checked == true ? 'true' : 'false') + '"';
    jsonString += "}";
    chrome.extension.sendMessage({
        sksmode: "saveoptionsdatamode",
        optionsdata: jsonString
    }, function(response) {
        if (response.output == "success") {
            sks_qg_setStatus('<img src="info.png" />&nbsp;Options saved successfully.', true);
            chrome.extension.sendMessage({ sksmode: "syncsettings" }, function (response) { });
        }
        else {
            sks_qg_setStatus('<img src="error.png" />&nbsp;Unable to save!', true);
        }
    });
}

function sks_showhide() {
    try {
        $("#div2").slideToggle("fast");
    }
    catch (Exc) { }
}

function sks_qg_load_values() {
    try {
        chrome.extension.sendMessage({
            sksmode: "optionsdatamode"
        }, sks_qg_load_options_data);
    }
    catch (Exx) {
        console.log(Exx.message);
    }
}

function sks_qg_check4Incognito() {
    try {
        chrome.tabs.getSelected(null, function(tb) {
            if (tb == null) {
                return;
            }
            if (tb.incognito == true) {
                document.getElementById("sks_qg_btnSave").disabled = true;
                sks_qg_setStatus('<img src="error.png" />&nbsp;Options cannot be saved in Incognito mode.', false);
            }
        });
    }
    catch (Exxc) {
        console.log(Exxc.message);
    }
}

function sks_qg_load_options_data(sks_qg_data) {
    try {
        var sks_qg_jsonData = jQuery.parseJSON(sks_qg_data.output);
        try {
            for (var i = 0; i < sks_qg_maxCount; i++) {
                var elem = document.getElementById("sks_qg_" + i).childNodes;
                for (var j = 0; j < elem.length; j++) {
                    if (elem[j].type == "text") {
                        elem[j].value = (j == 2 ? sks_qg_jsonData.data[i].n : sks_qg_jsonData.data[i].e);
                    }
                    else if (elem[j].type == "password") {
                        if (sks_qg_jsonData.data[i].p.length > 0) {
                            elem[j].value = AesCtr.decrypt(sks_qg_jsonData.data[i].p, sks_qg_security_pwd, 256);
                        }
                        else elem[j].value = "";
                    }
                }
            }
        }
        catch (Ex2) {
            console.log(Ex2.message);
        }
        if (sks_qg_jsonData.curTab) document.getElementById('chkCurrentTab').checked = sks_qg_jsonData.curTab == "true" ? true : false;
    }
    catch (Ex) {
        console.log(Ex.message);
    }
}

function sks_qg_checkNameValue(nameControl) {
    try {
        var sks_qg_val = String(nameControl.value);
        if (sks_qg_val.length > 0) {
            nameControl.value = sks_qg_val.trim();
        }
    }
    catch (Ex) { }
}
function sks_qg_validate_options() {
    for (var i = 0; i < sks_qg_maxCount; i++) {
        var elem = document.getElementById("sks_qg_" + i).childNodes;
        for (var j = 0; j < elem.length; j++) {
            if (elem[j].type == "text") // || elem[j].type == "password") 
            {
                //                        if (elem[j].id.indexOf("sks_qg__email") > -1) {
                //                            if (elem[j].value.length > 0) {
                //                                //Temporary fix for the issues reported. Will revisit here
                //                                if (!IsEmailValid(elem[j].value)) {
                //                                    var k = parseInt(i) + 1;
                //                                    sks_qg_setStatus('<img src="error.png" />&nbsp;Account #' + String(k) + ' has an invalid Email.', true);
                //                                    return false;
                //                                }
                //                            }
                //                        }
            }
        }
    }
    return true;
}

function sks_qg_setStatus(sks_qg_text, sks_qg_vanish) {
    document.getElementById('sks_qg_status').innerHTML = sks_qg_text;
    if (sks_qg_vanish == true) {
        setTimeout(function() {
            document.getElementById('sks_qg_status').innerHTML = '';
        }, 5000);
    }
}

function IsEmailValid(email) {
    var sks_qg_ret = true;
    try {
        sks_qg_ret = /^((([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+(\.([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+)*)|((\x22)((((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(([\x01-\x08\x0b\x0c\x0e-\x1f\x7f]|\x21|[\x23-\x5b]|[\x5d-\x7e]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(\\([\x01-\x09\x0b\x0c\x0d-\x7f]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))))*(((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(\x22)))@((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?$/i.test(email);
    }
    catch (Excc) { }
    return sks_qg_ret;
}
//analytics code
var _gaq = _gaq || [];
_gaq.push(['_setAccount', 'UA-34493097-1']);
_gaq.push(['_trackPageview']);

(function() {
    var ga = document.createElement('script'); ga.type = 'text/javascript'; ga.async = true;
    //ga.src = ('https:' == document.location.protocol ? 'https://ssl' : 'http://www') + '.google-analytics.com/ga.js';
    ga.src = 'https://ssl.google-analytics.com/ga.js';
    var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(ga, s);
})();