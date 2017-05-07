$(function() {
	chrome.commands.getAll(function(data) {
		var extensionPopup, extensionPresets;
		
		for (var i = 0, l = data.length; i < l; i++) {
			switch (data[i].name) {
				case '_execute_browser_action':
					extensionPopup = String(data[i].shortcut).replace(/\+/g, ' + ') || '&lt;undefined&gt;';
				break;
				
				case 'cycle-presets':
					extensionPresets = String(data[i].shortcut).replace(/\+/g, ' + ') || '&lt;undefined&gt;';
				break;
			}
		}
		
		$('#extensionPopup').html(extensionPopup);
		$('#extensionPresets').html(extensionPresets);
	});
	
	
	$('#openSettings').click(function(e) {
		e.preventDefault();
		
		chrome.tabs.create({
			url : 'chrome://extensions/configureCommands',
			active : true
		});
	})
})