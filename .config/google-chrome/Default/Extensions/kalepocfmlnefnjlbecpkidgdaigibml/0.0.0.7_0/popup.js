$(document).ready(function() {
    sks_bg_loadAccounts();
});
function sks_bg_loadAccounts() {
    chrome.extension.sendMessage({
        sksmode: "optionsdatamode"
    }, function(response) {
        var sks_qg_data = response.output;
        if (sks_qg_data == "") {
            sks_qg_createOptionsLink();
            return;
        }
        var sks_qg_jsonData = jQuery.parseJSON(sks_qg_data);
        var sks_qg_text = "";
        var sks_qg_linkExists = false;
        var sks_fb_accountCounts = 0;
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
                sks_fb_accountCounts++;
                sks_qg_createLinks(sks_qg_text, i); //other params removed
            }
        }
        if (sks_qg_linkExists == false) {
            sks_qg_createOptionsLink();
        }
        else {
            sks_qg_createOptionsLinkBottom();
        }
        loadAnalytics();
        if (sks_fb_accountCounts == 1)
            sks_qg_handleLinkClick(0);
    });
}
function sks_qg_createLinks(sks_qg_link, sks_qg_index, sks_fb_atleast1fbfeedURLExists, sks_fb_fbfeedURL) {
    var parents = document.getElementById("divLinks");
    var loginspan = document.createElement('span');
    loginspan.setAttribute("title", "Click to login");
    loginspan.setAttribute("id", "sks_fb_login" + sks_qg_index);
    loginspan.addEventListener("click", function() {
        sks_qg_handleLinkClick(sks_qg_index);
    }, false);
    loginspan.setAttribute("class", "eachcontrol");
    loginspan.innerHTML = "<img src='offline.png' alt='' id='img_" + sks_qg_index + "' />&nbsp;&nbsp;" + sks_qg_link;

    var child = document.createElement('div');
    child.setAttribute("class", "eachaccount");
    child.addEventListener("mouseover", function() {
        sks_qg_handleMouseOver(sks_qg_index);
    }, false);
    child.addEventListener("mouseout", function() {
        sks_qg_handleMouseOut(sks_qg_index);
    }, false);
    child.setAttribute("id", "sks_qg_" + sks_qg_index);
    child.appendChild(loginspan);
    parents.appendChild(child);
}
function sks_qg_handleMouseOver(sks_qg_index) {
    document.getElementById('img_' + sks_qg_index).src = 'online.png';
    document.getElementById("sks_qg_" + sks_qg_index).style.backgroundColor = '#EDFCFF'; //f3f7fc';
    document.getElementById("sks_qg_" + sks_qg_index).style.border = 'solid 1px #00D2FF';
    $('#sks_qg_' + sks_qg_index).css('-webkit-border-radius', '3px');
}
function sks_qg_handleMouseOut(sks_qg_index) {
    document.getElementById('img_' + sks_qg_index).src = 'offline.png';
    document.getElementById("sks_qg_" + sks_qg_index).style.backgroundColor = '#ffffff';
    document.getElementById("sks_qg_" + sks_qg_index).style.border = 'solid 1px #FFFFFF';
    document.getElementById("sks_qg_" + sks_qg_index).style.borderBottom = 'dotted 1px #E8EEFA';
}
function sks_qg_handleLinkClick(sks_qg_index) {
    var bgPage = chrome.extension.getBackgroundPage();
    bgPage.sks_qg_handleLink(sks_qg_index);
}
function sks_qg_createOptionsLink() {
    var parents = document.getElementById("divLinks");
    var child = document.createElement('div');
    child.setAttribute("class", "eachcontrol");
    child.setAttribute("id", "sks_qg_opt");
    child.innerHTML = "Twitter&trade; accounts are not configured in QuickTweet. <br />Click <a href='#' id='nooptions'>here</a> to configure.";
    parents.appendChild(child);
    sks_qg_bindOptionsEvent();
}
function sks_qg_bindOptionsEvent() {
    myAnchor = document.getElementById("nooptions");
    myAnchor.onclick = function() { sks_qg_showOptions(); return false; }
}
function sks_qg_createOptionsLinkBottom() {
    var parents = document.getElementById("divLinks");
    var child = document.createElement('div');
    child.setAttribute("id", "sks_qg_optb");
    child.setAttribute("style", "text-align:right;padding-top:4px;");
    child.innerHTML = '<a href="#" style="text-align:right;text-decoration:none;font-size:11px;color:#999999;" id="nooptions">Options</a>';
    parents.appendChild(child);
    sks_qg_bindOptionsEvent();
}
function sks_qg_showOptions() {
    var bgPage = chrome.extension.getBackgroundPage();
    bgPage.sks_qg_loadOptions();
}
//analytics code
var _gaq = _gaq || [];
_gaq.push(['_setAccount', 'UA-34493097-1']);
_gaq.push(['_trackPageview']);

//    (function() {
//        var ga = document.createElement('script'); ga.type = 'text/javascript'; ga.async = true;
//        //ga.src = ('https:' == document.location.protocol ? 'https://ssl' : 'http://www') + '.google-analytics.com/ga.js';
//        ga.src = 'https://ssl.google-analytics.com/ga.js';
//        var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(ga, s);
//    })();
function loadAnalytics() {
    try {
        var ga = document.createElement('script'); ga.type = 'text/javascript'; ga.async = true;
        //ga.src = ('https:' == document.location.protocol ? 'https://ssl' : 'http://www') + '.google-analytics.com/ga.js';
        ga.src = 'https://ssl.google-analytics.com/ga.js';
        var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(ga, s);
    }
    catch (anaEx) { }
}