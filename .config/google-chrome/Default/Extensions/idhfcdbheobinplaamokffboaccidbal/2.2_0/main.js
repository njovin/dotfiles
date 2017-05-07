var startWidth;
var startHeight;
var startURL;
var local = false;
var currentArray;
var backupArray;
var ads_disabled = false;
var ad_initiated = false;
var mode = 'popup';

chrome.windows.getCurrent(function(w) {
	startWidth = w.width;
	startHeight = w.height;
});

chrome.tabs.getSelected(null, function(t) {
	startURL = t.url;
});

$(document).ready(function(){

	mode = $('#mode').val();

	if(mode == "popup")
	{
		$('#viewAllBtn').click(viewAllClick);
		$('#resetBtn').click(resetWindow);
		$('#optionsBtn').click(openOptions);

		$('#selectAll').click(function(){
			SetAllCheckBoxes('checkboxForm', 'list', true);
		});

		$('#selectNone').click(function(){
			SetAllCheckBoxes('checkboxForm', 'list', false);
		});

		$('#selectInvert').click(function(){
			InvertCheckBoxes('checkboxForm', 'list');
		});

		$('.openOptions').click(openOptions);

		init({page: "main", local: false});
	}
	else if(mode == "options")
	{
		$('#addEntry').click(addEntry);
		$('#resetButton').click(resetFromXML);

		init({page: "options", local: false});
		//THIS FIXES CURSOR ON DRAG
		document.onselectstart = function () { return false; }
	}
});

function viewAllClick(e)
{
	openSelected('checkboxForm', 'list');
}

function init(params)
{
	if(params.local != null)
	{
		local = params.local;
	}

	var resArray = null;

	var ads_disabled = getPref("ads_disabled");
	if(ads_disabled == null || ads_disabled == "" || ads_disabled == undefined || ads_disabled == "undefined")
	{
		setPref("ads_disabled", false);
		ads_disabled = false;
	}

	initAds(mode);

	var closeOnResize = getPref("closeOnResize");
	if(closeOnResize == null || closeOnResize == "" || closeOnResize == undefined || closeOnResize == "undefined")
	{
		setPref("closeOnResize", false);
		closeOnResize = false;
	}

	var desktopNotifications = getPref("desktopNotifications");
	if(desktopNotifications == null || desktopNotifications == "" || desktopNotifications == undefined || desktopNotifications == "undefined")
	{
		setPref("desktopNotifications", false);
		desktopNotifications = false;
	}


	if(params == null || params.fromXML == null || params.fromXML == false)
	{
		resArray = getPref("resolutionArray");
	}

	if(resArray == null || resArray == "" || resArray == undefined || resArray == "undefined")
	{

		var newArray = [];

		$.ajax({
			type: "GET",
			url: "settings.xml",
			dataType: "xml",
			success: function(xml) {

				$(xml).find('resolution').each(function(){
					var newResolution = new Array(2);
					newResolution[0] = parseInt($(this).attr('width'));
					newResolution[1] = parseInt($(this).attr('height'));
					newArray.push(newResolution);
				});

				setPref("resolutionArray", newArray);
				if(params.page == "main")
				{
					drawList(newArray);
				}
				else if(params.page == "options")
				{
					if(params.fromXML == null || params.fromXML == false)
					{
						backupArray = newArray;
					}
					drawOptionsList(newArray);
				}
			}
		});

	}
	else
	{
		// console.log("Local storage loaded");
		if(params.page == "main")
		{
			drawList(resArray);
		}
		else if(params.page == "options")
		{
			if(params.fromXML == null || params.fromXML == false)
			{
				backupArray = resArray;
			}
			drawOptionsList(resArray);
		}
	}

	if(params.page == "options")
	{
		if(getPref("desktopNotifications"))
		{
			$('input#deskNotifCheckbox').attr("checked", true);
		}
		else
		{
			$('input#deskNotifCheckbox').attr("checked", false);
		}

		if(getPref("closeOnResize"))
		{
			$('input#closeBoxCheckbox').attr("checked", true);
		}
		else
		{
			$('input#closeBoxCheckbox').attr("checked", false);
		}
	}

	$('input#closeBoxCheckbox').change(function () {

		if ($(this).attr("checked")) {
			setPref("closeOnResize", true);
			return;
		}

		setPref("closeOnResize", false);
	});

	$('input#deskNotifCheckbox').change(function () {

		if ($(this).attr("checked")) {
			setPref("desktopNotifications", true);
			return;
		}

		setPref("desktopNotifications", false);
	});

}

//draw main popup list
function drawList(newArray)
{
	$('.resList').empty();

	var i = 0;
	for(i = 0; i < newArray.length; i++)
	{
		var width = newArray[i][0];
		var height = newArray[i][1];

		//$('body').append('<br>' + width);

		var $newRow = $('<li resizeWidth="'+width+'" resizeHeight="'+height+'"><img src="application_double.png" alt="" width="16" height="16" /><a href="">'+width+' x '+height+'</a><input type="checkbox" name="list" id="checkbox'+i+'" /></li>').appendTo('.resList');

		$newRow.find('a').click(windowResizeClick);
		$newRow.find('img').click(windowResizeClick);
	}
}

function windowResizeClick(e)
{
	e.preventDefault();
	var $row = $(this).parent();
	changeWindowSize($row.attr("resizeWidth"), $row.attr("resizeHeight"), false);
}

//draw options page list
function drawOptionsList(newArray, params)
{
	currentArray = newArray;

	$('.resList').empty();

	var i = 0;
	for(i = 0; i < newArray.length; i++)
	{
		var width = newArray[i][0];
		var height = newArray[i][1];

		//$('body').append('<br>' + width);

		var newRow = $('<li id="entry'+i+'"><div class="removeBtn"></div><div class="dragArrows"></div><img src="application_double.png" alt="" width="16" height="16" />'+width+' x '+height+'</li>').click(removeEntryClick);

		$('.resList').append(newRow);
	}

	if(params != null)
	{
		if(params.animateLast)
		{
			var entryNum = i-1;
			$('#entry'+entryNum).hide();
			$('#entry'+entryNum).slideDown(300);
		}
	}

	$(".resList").sortable( "destroy" );
	$(".resList").sortable({ axis: 'y', cursor: 'crosshair', handle: '.dragArrows', stop: onSortStop});
}

function onSortStop()
{
	var result = $('.resList').sortable('toArray');
	var elementNums = new Array();
	for(var i = 0; i < result.length; i++)
	{
		elementNums.push(parseInt(result[i].split('entry').slice(-1)));
	}

	var newArray = new Array();
	for(i = 0; i < elementNums.length; i++)
	{
		newArray.push(currentArray[elementNums[i]]);
	}

	currentArray = newArray;
	setPref("resolutionArray", currentArray);
	drawOptionsList(currentArray);

}

function resetFromBackup()
{
	alert(backupArray);
	setPref("resolutionArray", backupArray);
	drawOptionsList(backupArray);
	alert(backupArray);
}

function resetFromXML()
{
	if(confirm("This can't be undone, are you sure you want to reset to defaults?"))
	{
		init({page: "options", fromXML: true});
	}
}

function Vector (x, y) {
    this.x = x;
    this.y = y;
}

//var windowInfo = chrome.windows.get(0);
//var i = 0;
//document.write("<h1>Hello World!</h1>");
//document.write(i);

function changeWindowSize(newWidth, newHeight, newWindow)
{
	newWidth = parseInt(newWidth);
	newHeight = parseInt(newHeight);

	if(!newWindow)
	{

		chrome.windows.getCurrent(function(w) {
			chrome.windows.update(w.id, {width: newWidth, height: newHeight, state: "normal"});
			document.getElementById("results").innerHTML = "<img src=\"information.png\"> Window size changed to: " + newWidth + " x " + newHeight;
		});
	}
	else
	{
		chrome.tabs.getSelected(null, function(t) {

			var URL = t.url;

			chrome.windows.create({url: URL, width: newWidth, height: newHeight, state: "normal"});
		});
	}

	if(getPref("desktopNotifications") == true)
	{
		// Create a simple text notification:
		var notification = webkitNotifications.createNotification(
		  'icon48.png',  // icon url - can be relative
		  'Window Resized',  // notification title
		  'Window size changed to: ' + newWidth + ' x ' + newHeight   // notification body text
		);

		notification.show();
	}

	if(getPref("closeOnResize") == true)
	{
		window.close();
	}



}

function changeWindowSizeCustom()
{
	chrome.windows.getCurrent(function(w) {
		var newWidth = document.getElementById("widthInput").value;
		var newHeight = document.getElementById("heightInput").value;
		if(newWidth == "" || newHeight == "" || newWidth == "Width" || newHeight == "Height")
		{
			document.getElementById("results").innerHTML = "<img src=\"exclamation.png\"> Please fill in both fields";
		}
		else
		{
			newWidth = parseInt(newWidth);
			newHeight = parseInt(newHeight);
			changeWindowSize(newWidth, newHeight, false);
		}
	});
}

function getLink(i)
{
	if(i == 1)
	{
		chrome.tabs.create({url: "http://www.benbeckford.com"});
	}
	else if(i == 2)
	{
		chrome.tabs.create({url: "http://www.famfamfam.com"});
	}
}

function SetAllCheckBoxes(FormName, FieldName, CheckValue)
{
	if(!document.forms[FormName])
		return;
	var objCheckBoxes = document.forms[FormName].elements[FieldName];
	if(!objCheckBoxes)
		return;
	var countCheckBoxes = objCheckBoxes.length;
	if(!countCheckBoxes)
		objCheckBoxes.checked = CheckValue;
	else
		// set the check value for all check boxes
		for(var i = 0; i < countCheckBoxes; i++)
			objCheckBoxes[i].checked = CheckValue;
}

function InvertCheckBoxes(FormName, FieldName)
{
	if(!document.forms[FormName])
		return;
	var objCheckBoxes = document.forms[FormName].elements[FieldName];
	if(!objCheckBoxes)
		return;
	var countCheckBoxes = objCheckBoxes.length;
	if(!countCheckBoxes)
		objCheckBoxes.checked = !objCheckBoxes.checked;
	else
		// set the check value for all check boxes
		for(var i = 0; i < countCheckBoxes; i++)
			objCheckBoxes[i].checked = !objCheckBoxes[i].checked;
}

function resetWindow()
{
	changeWindowSize(startWidth, startHeight, false);
}

function openSelected(FormName, FieldName)
{
	var resolutionArray = new Array();
	// resolutionArray.push(new Vector(640, 480));
	resolutionArray.push(new Vector(800, 600));
	resolutionArray.push(new Vector(1024, 768));
	resolutionArray.push(new Vector(1280, 600));
	resolutionArray.push(new Vector(1280, 800));
	resolutionArray.push(new Vector(1280, 960));
	resolutionArray.push(new Vector(1280, 1024));
	resolutionArray.push(new Vector(1440, 900));
	resolutionArray.push(new Vector(1600, 1200));
	resolutionArray.push(new Vector(1920, 1080));
	resolutionArray.push(new Vector(1920, 1200));

	if(!document.forms[FormName])
		return;
	var objCheckBoxes = document.forms[FormName].elements[FieldName];
	if(!objCheckBoxes)
		return;
	var countCheckBoxes = objCheckBoxes.length;
	if(!countCheckBoxes)
	{
		if(objCheckBoxes.checked)
		{
				changeWindowSize(resolutionArray[0].x, resolutionArray[0].y, true);
		}
	}
	else
	{
		for(var i = 0; i < countCheckBoxes; i++)
		{
			if(objCheckBoxes[i].checked)
			{
				changeWindowSize(resolutionArray[i].x, resolutionArray[i].y, true);
			}
		}
	}


}

function showCustomBox()
{
	$('#customBox').slideDown(300);
}

function removeEntryClick(e)
{
	removeEntry(this.id.replace('entry',''));
}

function removeEntry(i)
{
	currentArray.splice(i, 1);
	setPref("resolutionArray", currentArray);
	$('#entry'+i).slideUp(300, function()
	{
		drawOptionsList(currentArray);
	});
}

function addEntry()
{
	var newWidth = document.getElementById("widthInput").value;
	var newHeight = document.getElementById("heightInput").value;

	var reg_isinteger = /^\d+$/;

	if(newWidth != "" && newHeight != "" && reg_isinteger.test(newWidth) && reg_isinteger.test(newHeight))
	{
		var newResolution = new Array(2);
		newResolution[0] = newWidth;
		newResolution[1] = newHeight;
		currentArray.push(newResolution);
		setPref("resolutionArray", currentArray);
		drawOptionsList(currentArray, {animateLast: true});
	}
	else
	{
		$('#notify').slideDown(300).delay(1500).slideUp(300);
	}
}

function setPref(key, value) {
	if(!local)
	{
		var config = {};
		if (localStorage.config) {
			config = JSON.parse(localStorage.config);
		}
		config[key] = value;
		localStorage.config = JSON.stringify(config);
	}
}

function getPref(key) {
	if(!local)
	{
		if (!localStorage.config) {
			return undefined;
		}
		var config = JSON.parse(localStorage.config);
		return config[key];
	}
	else
	{
		return null;
	}
}

function openOptions()
{
	window.open(chrome.extension.getURL("options.html"));
}

function toggleAd(onOff) {
	if(onOff)
	{
		if(!ad_initiated)
		{
			var widthHeight = mode == 'popup' ? '180' : '230';
			$('#adFrame').html('<div class="button disableAds" id="disableAds"><img src="emoticon_smile.png" width="16" height="16"><span style="font-weight: bold;">Disable ads</span> &lt; a coffee!</div><iframe width="'+widthHeight+'" height="'+widthHeight+'" allowtransparency="true" frameborder="0" scrolling="no" seamless="seamless" src="http://benbeckford.com/resolution_test/ads_'+widthHeight+'.htm"></iframe>');
			$('body').removeClass('adsOff');
			$('#disableAds').click(disableAdsPurchase);
			ad_initiated = true;
		}
	}
	else
	{
		var purchasedHTML = mode == 'options' ? '<p>Ads are disabled, thank you for your support :)</p><br>' : '';
		$('#adFrame').html(purchasedHTML);
		$('body').addClass('adsOff');
		ad_initiated = false;
	}
}

function disableAdsPurchase() {
	google.payments.inapp.buy({
	  'parameters': {'env': 'prod'},
	  'sku': '001',
	  'success': onPurchase,
	  'failure': onPurchaseFail
	});
}

function onPurchase()
{
	alert("Purchase successful - thank you for your support! Ads are now disabled :)");
	ads_disabled = true;
	setPref("ads_disabled", true);
	initAds();
}

function onPurchaseFail()
{
	// alert("Purchase failed for some reason - please try again :)");
}

function initAds(mode)
{
	toggleAd(!ads_disabled);

	google.payments.inapp.getPurchases({
		'parameters': {'env': 'prod'},
		'success': onLicenseUpdate,
		'failure': onLicenseUpdateFail
	});

	// google.payments.inapp.getSkuDetails({
	//   'parameters': {'env': 'prod'},
	//   'success': onSkuDetails,
	//   'failure': onSkuDetailsFail
	// });
}

function onLicenseUpdate(response) {
	// console.log("onLicenseUpdate",response);

	if(response.response.details.length > 0 && response.response.details[0].sku == "001")
	{
		setPref("ads_disabled", true);
		ads_disabled = true;
		toggleAd(false);
	}
}

function onLicenseUpdateFail(response) {
	// console.log("onLicenseUpdateFail",response);
}

function onSkuDetails(response) {
	// console.log("onSkuDetails",response);
}

function onSkuDetailsFail(response) {
	// console.log("onSkuDetailsFail",response);
}