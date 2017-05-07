var DOMAIN = 'chrome.todoist.com'; 

/*
 * For fetching the current location and title
 */
var CURRENT_LOCATION = {
    'location': '',
    'title': ''
}

function getCurrentLocationAndTitle() {
    return CURRENT_LOCATION;
}

setInterval(function() {
    chrome.tabs.getSelected(null, function(tab) {
        if(tab) {
            CURRENT_LOCATION.location = tab.url;
            CURRENT_LOCATION.title = tab.title;
        }
    });
}, 200);


/*
 * For remebering the last viewed iframe URL 
 */
var FRAME_SRC = null;
function setFrameLocation(url) {
    if(url) {
        FRAME_SRC = url;
        if(window.localStorage)
            localStorage['frame_src'] = url;
    }
}

function getFrameLocation() {
    var saved = null;

    if(window.localStorage)
        saved = window.localStorage['frame_src'];

    if(saved)
        return saved;
    else
        return FRAME_SRC;
}

function getSession() {
    return window.localStorage;
}


/*
 * For updating task count badge and logging in/out
 */
chrome.extension.onRequest.addListener(
    function(request, sender, sendResponse) {
        if(request.type == 'update_badge') {
            chrome.browserAction.setBadgeText({text: '0'});
            updateBadge(request.total_count, request.is_overdue);
        }
});

function updateBadge(total_count, is_overdue) {
    if(total_count == 0) {
        chrome.browserAction.setBadgeText({text: ''});
    }
    else {
        chrome.browserAction.setBadgeText({ text: ''+total_count });
        chrome.browserAction.setBadgeBackgroundColor({ color: [0, 0, 0, 255] })
    }
}

function checkTodoistCounts() {
    if(window.CURRENT_XHR) {
        window.CURRENT_XHR.abort();
        window.CURRENT_XHR = null;
    }

    var xhr = new XMLHttpRequest();
    window.CURRENT_XHR = xhr;

    xhr.open('GET', 'https://ext.todoist.com/Agenda/getCount', true);

    xhr.onreadystatechange = function() {
        if (xhr.readyState == 4 && xhr.status == 200) {
            try {
                var counts = window.JSON.parse( xhr.responseText );
                updateBadge(counts.today + counts.overdue,
                            counts.overdue > 0);
            }
            catch(e) {
            }
        }
        else if(xhr.readyState == 4 && xhr.status == 403) {
            chrome.browserAction.setBadgeBackgroundColor({ color: [219, 76, 63, 255] })
            chrome.browserAction.setBadgeText({text: '?'});
        }
    }
    xhr.send(null);
}

setInterval(checkTodoistCounts, 480000);
checkTodoistCounts();


/*
 * Context menu adding
 */
function addToTodoistFromMenu(ev, tab) {
    var content = ev.pageUrl;

    var sel_text = tab && tab.title || '';
    if(ev.selectionText) {
        sel_text = ev.selectionText;
    }

    sel_text = sel_text.replace(/\(/g, '[').replace(/\)/g, ']');
    if(sel_text.length > 0)
        content = content + ' (' + sel_text + ')';

    if(content.length > 0) {
        var notification_id = 'add_to_todoist_' + (new Date()).getTime();

        var xhr = new XMLHttpRequest();

        xhr.open('POST', 'https://'+DOMAIN+'/quickAdd', true);

        xhr.onreadystatechange = function() {
            var opts = {
                type: "basic",
                iconUrl: "todoist_256.png"
            };

            if (xhr.readyState == 4 && xhr.status == 200) {
                opts.title = "Added To Todoist";
                opts.message = sel_text;
            }
            else if(xhr.readyState == 4) {
                opts.title = "Could not add to Todoist";
                opts.message = "Please make sure you are logged in";
            }

            chrome.notifications.create(notification_id, opts);

            setTimeout(checkTodoistCounts, 500);

            setTimeout(function() {
                chrome.notifications.clear(notification_id);
            }, 5000);
        }

        xhr.setRequestHeader("Content-type","application/x-www-form-urlencoded");
        
        xhr.send("content=" + encodeURIComponent(content));
    }
}

chrome.contextMenus.create({
    "title": chrome.i18n.getMessage("addToTodoist"),
    "contexts": ["page", "selection",  "link"],
    "onclick" : addToTodoistFromMenu
});
