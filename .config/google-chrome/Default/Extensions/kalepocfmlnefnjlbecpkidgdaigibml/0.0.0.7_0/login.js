sks_fb_logoutIfNeeded();
function sks_fb_logoutIfNeeded() {
    if (!sks_fb_isLoginForm())// if not login form 
    {
        chrome.extension.sendMessage({
            sksmode: "runmode"
        }, function(response) {
            var sks_fb_runmode = response.output;
            var sks_fb_runModeInt = parseInt(sks_fb_runmode);
            if (sks_fb_runModeInt > -1) {
                setTimeout(sigmeOut, 100);
            }
        });
    }
}
function sigmeOut() {
    var signingOut = false;
    if ($('#signout-button').length) {
        signingOut = true;
        $('#signout-button').click();
    }
    if ($('#signout-form').length) {
        signingOut = true;
        $('#signout-form').submit();
    }
    if (signingOut === false) {
        if (window.location.href.toLowerCase().indexOf("twitter.com/login") < 0) {
            window.location.href = "https://twitter.com/login";
        }
    }
}
function sks_fb_isLoginForm() {
    var sks_fb_islogin = false;
    sks_fb_islogin = $('form[action^="https://twitter.com/sessions"]').length > 0;
    return sks_fb_islogin;
}
if (sks_fb_isLoginForm()) {
    chrome.extension.sendMessage({
        sksmode: "runmode"
    }, function(response) {
        var runmode = response.output;
        var runModeInt = parseInt(runmode);
        if (runModeInt > -1) {
            sks_qg_loginWithCurrentAccount();
        }
        else {
            var child = document.createElement('div');
            var imgURL = chrome.extension.getURL("icon_open_left2.png");
            var imgHoverLeftURL = chrome.extension.getURL("hover_left.png");
            var imgHoverRightURL = chrome.extension.getURL("hover_right.png");
            child.innerHTML = "<div id='sks_qg_assistant_div' style='padding:6px;-webkit-border-radius:5px;'><img src='" + imgURL + "' alt='QuickTweet - Accounts' style='' /></div>";
            child.setAttribute("id", "sks_fb_accounts");
            child.addEventListener("mouseover", function() {
                var cell = document.getElementById("sks_fb_accounts");
                if (cell != null) {
                    cell.style.border = 'solid 1px #B2B2B2';
                    cell.style.backgroundColor = '#FFFFFF';
                    document.getElementById("sks_qg_assistant_div").innerHTML = "<div style='padding:5px 10px;-webkit-border-radius:3px;background-color:#049CD3;font-size:small;text-align:center;color:#ffffff;'>&nbsp;QuickTweet&nbsp;</div>";
                }
                if (cell.hasChildNodes()) {
                    for (var sks_qg_i = 1; sks_qg_i < cell.childNodes.length; sks_qg_i++) {
                        cell.childNodes[sks_qg_i].style.display = "block";
                    }
                }
            }, false);
            child.addEventListener("mouseout", function() {
                var cell = document.getElementById("sks_fb_accounts");
                if (cell != null) {
                    cell.style.border = 'none';
                    cell.style.backgroundColor = 'transparent';
                    document.getElementById("sks_qg_assistant_div").innerHTML = "<img src='" + imgURL + "' alt='QuickTweet - Accounts' style='' />";
                }
                if (cell.hasChildNodes()) {
                    for (var sks_qg_i = 1; sks_qg_i < cell.childNodes.length; sks_qg_i++) {
                        cell.childNodes[sks_qg_i].style.display = "none";
                    }
                }
            }, false);
            child.setAttribute("style", "position:absolute;float:right;top:0px;right:1px;text-align:right;padding-bottom:10px;z-index:10000;-webkit-border-bottom-right-radius: 5px;-webkit-border-bottom-left-radius: 5px;");
            document.body.appendChild(child);
            chrome.extension.sendMessage({
                sksmode: "optionsdatamode"
            }, function(response) {
                var sks_qg_data = response.output;
                if (sks_qg_data == "") {
                    document.body.removeChild(document.getElementById("sks_fb_accounts"));
                    return;
                }
                var sks_qg_jsonData = jQuery.parseJSON(sks_qg_data);
                var sks_qg_text = "";
                var sks_qg_linkExists = false;
                for (var i = 0; i < sks_qg_jsonData.data.length; i++) {
                    sks_qg_text = "";
                    if (sks_qg_jsonData.data[i].n.length > 0) {
                        sks_qg_text = sks_qg_jsonData.data[i].n;
                    }
                    else if (sks_qg_jsonData.data[i].e.length > 0) {
                        sks_qg_text = sks_qg_jsonData.data[i].e;
                    }
                    else if (sks_qg_jsonData.data[i].p.length > 0) {
                        sks_qg_text = "[Unknown]";
                    }
                    if (sks_qg_text.length > 0) {
                        sks_qg_linkExists = true;
                        sks_qg_createLinks(sks_qg_text, i);
                    }
                }
                if (sks_qg_linkExists == true) {
                    ////document.body.style.marginLeft = "13px";
                }
                else {
                    document.body.removeChild(document.getElementById("sks_fb_accounts"));
                }
            });
        }
    });
}
function sks_qg_createLinks(sks_qg_link, sks_qg_index) {
    try {
        var parents = document.getElementById("sks_fb_accounts");
        var child = document.createElement('div');
        child.addEventListener("mouseover", function() {
            document.getElementById('sks_qg_' + sks_qg_index).style.backgroundColor = '#EDFCFF';
            document.getElementById('img_' + sks_qg_index).src = chrome.extension.getURL("online.png");
            document.getElementById('sks_qg_' + sks_qg_index).style.border = 'solid 1px #00D2FF';
            $('#sks_qg_' + sks_qg_index).css('-webkit-border-radius', '3px');
        }, false);
        child.addEventListener("mouseout", function() {
            document.getElementById('sks_qg_' + sks_qg_index).style.backgroundColor = '#ffffff';
            document.getElementById('img_' + sks_qg_index).src = chrome.extension.getURL("offline.png");
            document.getElementById('sks_qg_' + sks_qg_index).style.border = 'solid 1px #FFFFFF';
            document.getElementById('sks_qg_' + sks_qg_index).style.borderBottom = 'dotted 1px #E8EEFA';
        }, false);
        child.addEventListener("click", function() {
            chrome.extension.sendMessage({
                sksmode: "setrunmode",
                runmodedata: sks_qg_index
            }, function(response) {
                sks_qg_loginWithCurrentAccount();
            });
        }, false);
        child.setAttribute("id", "sks_qg_" + sks_qg_index);
        child.setAttribute("style", "cursor:pointer;display:none;padding:6px;white-space:nowrap;border-bottom:dotted 1px #E8EEFA;font-size:small;margin-left:8px;margin-right:8px;text-align:left;border:solid 1px #FFFFFF;");
        child.innerHTML = "<img src='" + chrome.extension.getURL("offline.png") + "' alt='' id='img_" + sks_qg_index + "' />&nbsp;&nbsp;" + sks_qg_link;
        parents.appendChild(child);
    }
    catch (Excc) {
        console.log(Excc.description);
    }
}
function sks_qg_loginWithCurrentAccount() {
    try {
        chrome.extension.sendMessage({
            sksmode: "getcurrentcredentials"
        }, function(response) {
            var sks_qg_data = response.output;
            if (sks_qg_data == "") {
                return;
            }
            var sks_qg_jsonData = jQuery.parseJSON(sks_qg_data);
            var sks_qg_username = sks_qg_jsonData.username;
            var sks_qg_password = sks_qg_jsonData.password;
            if (sks_qg_username.length > 0) {
                $('input[type=text][name="session[username_or_email]"]').val(sks_qg_username);
            }
            if (sks_qg_password.length > 0) {
                $('input[type=password][name="session[password]"]').val(sks_qg_password);
            }
            if (sks_qg_password.length > 0 && sks_qg_username.length > 0) {
                $('form[action^="https://twitter.com/sessions"]').submit();
            }
            chrome.extension.sendMessage({
                sksmode: "resetrunmode"
            }, function(response) { });
        });
    } catch (Exce) {
        console.log(Exce.description);
    }
}