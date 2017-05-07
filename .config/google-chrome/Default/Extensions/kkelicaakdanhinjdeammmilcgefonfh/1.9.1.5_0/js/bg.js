var iconBehavior = window.localStorage[iconBehaviorSetting] || 0;

setPopup(iconBehavior);

var verNo = window.localStorage[verStorage] || 0;

if (verNo < 180.1) {
	// migrate presets format
	var rows = getRows();

	if (rows) {
		for (var i = 0, l = rows.length; i < l; i++) {
			if (rows[i].type == 'mobile') {
				rows[i].type   = 'featurephone';
				rows[i].target = 'viewport';
			} else if (!rows[i].target) {
				rows[i].target = 'window';
			}
		}

		window.localStorage[rowStorage] = JSON.stringify(rows);
	}
}

chrome.runtime.setUninstallURL('http://coolx10.com/window-resizer/good-bye.php');

chrome.runtime.onInstalled.addListener(function(details) {
	switch (details.reason) {
		case 'install':
			window.localStorage[verStorage] = currentVersion;

			chrome.tabs.create({
				url: 'http://coolx10.com/window-resizer/welcome.php',
				active: true
			});
		break;

		case 'update':
			if (verNo < 191.4) {
				chrome.browserAction.setBadgeText({text : 'NEW'});
				chrome.browserAction.setBadgeBackgroundColor({color : '#dd8127'});
			} else {
				window.localStorage[verStorage] = currentVersion;
			}
		break;
	}
})


// add listener for shortcut keys
chrome.commands.onCommand.addListener(function(command) {
	var match = String(command).match(/presets\-(\d+)/);

	if (command == 'cycle-presets') {
		cyclePresets();
	}

	if (command == 'cycle-presets-reverse') {
		cyclePresets(true);
	}

	if (command == 'manual-tooltip-toggle') {
		chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
			chrome.tabs.sendMessage(tabs[0].id, {manualTooltipToggle: true});
		});
	}

	if (match) {
		var idx  = parseInt(match[1], 10) - 1,
		    rows = getRows();

		if (rows[idx]) {
			resizeWindow(rows[idx]);
		}
	}
});


// add event listener for clicks on the extension icon
chrome.browserAction.onClicked.addListener(function(TAB) {

	var iconBehavior = window.localStorage[iconBehaviorSetting] || 0;

	if ( iconBehavior == 1 ) {
		cyclePresets();
	}

});

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
	if ( request.hideTooltipSetting == true ) {
		sendResponse( {
						hideTooltipSetting : parseInt(window.localStorage['WindowResizer.Tooltip']),
						tooltipDelay : parseInt(window.localStorage['WindowResizer.TooltipDelay'])
		} );
	}

	if ( request.openSettings == true ) {
		chrome.tabs.create({"url" : "settings.html"});
	}
});

chrome.windows.onCreated.addListener(function (win) {
	if ( win.type == 'popup' ) {
		CTX.create();
	} else {
		CTX.remove();
	}
});

chrome.windows.onFocusChanged.addListener(function(windowId){
	if ( windowId != chrome.windows.WINDOW_ID_NONE ) {
		chrome.windows.get(windowId, function (win) {
			if (chrome.runtime.lastError) {
				return;
			}
			if ( win.type == 'popup' ) {
				CTX.create();
			} else {
				CTX.remove();
			}
		});
	}
});

var CTX = {
	_main : false,

	items : {},

	create : function() {
		if ( !this._main ) {
			try {
				this._main = chrome.contextMenus.create({
					id       : 'main',
					title    : 'Resize window',
					contexts : ['all']
				});

				var rows = getRows();
				var hideTitle = window.localStorage[popupDescriptionSetting];

				for ( var r = 0, l = rows.length; r < l; r++  ) {
					var row = rows[r];
					var title = row.width + ' x ' + row.height;
					title += (row.title && !hideTitle) ? ' - ' + row.title : '';

					var i = chrome.contextMenus.create({
					    id       : 'resize_' + r,
						title    : title,
						contexts : ['all'],
						parentId : this._main
					});

					this.items[i] = row;
				}

				chrome.contextMenus.create({
					id       : 'sep_1',
					type     : 'separator',
					contexts : ['all'],
					parentId : this._main
				});

				chrome.contextMenus.create({
					id       : 'customize',
					title    : '[Customize]',
					contexts : ['all'],
					parentId : this._main
				});

				chrome.contextMenus.create({
					id       : 'settings',
					title    : '[Settings]',
					contexts : ['all'],
					parentId : this._main
				});
			} catch (e) {

			}
		}
	},

	remove : function() {
		this._main = false;
		this.items = {};
		chrome.contextMenus.removeAll();
	}
}

chrome.contextMenus.onClicked.addListener(function(info, tab) {
	switch (true) {
		case (info.menuItemId == 'customize') :
			chrome.tabs.create( { url : 'options.html', selected : true } );
		break;

		case (info.menuItemId == 'settings') :
			chrome.tabs.create( { url : 'settings.html', selected : true } );
		break;

		default :
			resizeWindow(CTX.items[info.menuItemId]);
		break;
	}
});