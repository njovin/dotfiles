/*! Copyright 2009-2017 Evernote Corporation. All rights reserved. */

define(["GlobalUtils","PageInfo","ContentPreview","Promotion"],function(a,b,c,d){function e(a){ba&&(ba.getElement()&&ba.getElement().parentNode&&ba.getElement().parentNode.removeChild(ba.getElement()),a&&ba.destroy()),a&&(ba=null),document.documentElement.classList.remove("skitchWaiting","skitchReady")}function f(a,b,d){e(a.notClipping),c.clear(),!$.classList.contains("evernoteClipperVisible")||document.documentElement.classList.contains("evernoteOptionsOpen")?($.classList.remove("evernoteClipperVisible"),z()):($.addEventListener(Browser.whichTransitionEnd(),z),$.classList.remove("evernoteClipperVisible")),_&&_.parentNode&&(_.parentNode.removeChild(_),_=null),document.documentElement.classList.remove("evernoteOptionsOpen"),a.notClipping&&(c.reset(),c.clearHighlights()),window.removeEventListener("keydown",B),window.removeEventListener("keypress",C),window.removeEventListener("mousedown",D),window.removeEventListener("unload",E),Browser.sendToExtension({name:"showLoggedInOrOutState"}),Browser.setInterceptSpecialKeys(!1),d&&"function"==typeof d&&d()}function g(a,b,c){"function"==typeof ga[a.keycode]&&ga[a.keycode](a.keycode,null,!0),c&&"function"==typeof c&&c()}function h(a,b,c){document.documentElement.classList.add("skitchWaiting"),c&&"function"==typeof c&&c()}function i(a,b,c){document.documentElement.classList.contains("evernoteOptionsOpen")?o({authed:!0}):$.classList.contains("evernoteClipperVisible")&&(c?f({notClipping:!0}):Browser.sendToExtension({name:"bounce",message:{name:"gt_handleEscape",keycode:a}}))}function j(a){$.classList.contains("evernoteClipperVisible")&&!document.documentElement.classList.contains("skitchReady")&&("notebook"===a?Browser.sendToExtension({name:"bounce",message:{name:"gt_openNotebook"}}):"tags"===a&&Browser.sendToExtension({name:"bounce",message:{name:"gt_openTags"}}))}function k(){Browser.sendToExtension({name:"bounce",message:{name:"gt_toggleAccount"}})}function l(a){$.classList.contains("evernoteClipperVisible")&&!document.documentElement.classList.contains("skitchReady")&&("expand"==a?c.expandPreview():"contract"==a?c.contractPreview():"up"==a?c.moveToElementAbove():"down"==a&&c.moveToElementBelow())}function m(a,b){fa&&ga[a]&&ga[a](a,b)}function n(a,b){ga[a]&&ga[a](a,b)}function o(a,b,c){a.authed?(Browser.sendToExtension({name:"bounce",message:{name:"gt_reactivateClipperTool"}}),_&&_.parentNode&&(_.parentNode.removeChild(_),_=null),document.documentElement.classList.remove("evernoteOptionsOpen")):f({notClipping:!0}),c&&"function"==typeof c&&c()}function p(){M(),document.documentElement.appendChild($),EDGE&&"auto"===getComputedStyle($).getPropertyValue("right")&&Browser.sendToExtension({name:"insertCSS",filename:["css/contentpreview.css","content/clip_result/iframe.css","content/tooltips/TooltipCoordinator.css","content/tooltips/gmail_tooltip_check.css","css/coordinator.css"]}),window.addEventListener("keydown",B),window.addEventListener("keypress",C),window.addEventListener("mousedown",D),window.addEventListener("unload",E),Browser.sendToExtension({name:"getKeyboardShortcuts",shortcuts:["closeWebClipperShortcut","previewArticleShortcut","previewFullPageShortcut","previewUrlShortcut","selectionModeShortcut","takeScreenshotShortcut","clearlyShortcut","pdfShortcut","emailShortcut","expandArticleShortcut","contractArticleShortcut","moveArticleUpShortcut","moveArticleDownShortcut","toggleAccountShortcut","selectNotebookShortcut","addTagsShortcut","saveShortcut","minimizeClipperShortcut","arrowShortcut","textShortcut","rectangleShortcut","roundedRectangleShortcut","ellipseShortcut","lineShortcut","markerShortcut","highlighterShortcut","stampShortcut","pixelateShortcut","cropShortcut"]}),ja++}function q(a,b,c){$&&$.classList.contains("evernoteClipperVisible")&&Browser.sendToExtension({name:"showOpenState"}),c&&"function"==typeof c&&c()}function r(a){return function(){Q(a)}}function s(a,b){return function(){t(),R(a,b)}}function t(){Browser.sendToExtension({name:"bounce",message:{name:"gt_maximizeClipper"}})}function u(a,b,c){fa=a.keyboardShortcutsEnabled;var d={};for(var e in a.keys){var f=a.keys[e].split("|"),g=f.join(" + ");switch(d[g]=m,ha[e]=[g],e){case"startWebClipperShortcut":ga[g]=S;break;case"closeWebClipperShortcut":d[g]=n,ga[g]=i,ia[e]=[g];break;case"previewArticleShortcut":ga[g]=r("article");break;case"previewFullPageShortcut":ga[g]=r("fullPage");break;case"previewUrlShortcut":ga[g]=r("url");break;case"selectionModeShortcut":ga[g]=r("selection");break;case"takeScreenshotShortcut":EDGE||(ga[g]=r("screenshot"));break;case"clearlyShortcut":ga[g]=r("clearly");break;case"pdfShortcut":EDGE||(ga[g]=r("pdf"));break;case"emailShortcut":ga[g]=r("email");break;case"expandArticleShortcut":d[g]=n,ga[g]=function(){t(),l("expand")};break;case"contractArticleShortcut":d[g]=n,ga[g]=function(){t(),l("contract")};break;case"moveArticleUpShortcut":d[g]=n,ga[g]=function(){t(),l("up")};break;case"moveArticleDownShortcut":d[g]=n,ga[g]=function(){t(),l("down")};break;case"toggleAccountShortcut":ga[g]=k;break;case"selectNotebookShortcut":ga[g]=function(){t(),j("notebook")};break;case"addTagsShortcut":ga[g]=function(){t(),j("tags")};break;case"saveShortcut":ga[g]=H;break;case"minimizeClipperShortcut":ga[g]=I;break;case"arrowShortcut":ga[g]=s("shapes","arrow");break;case"textShortcut":ga[g]=s("text");break;case"rectangleShortcut":ga[g]=s("shapes","rectangle");break;case"roundedRectangleShortcut":ga[g]=s("shapes","roundedRectangle");break;case"ellipseShortcut":ga[g]=s("shapes","ellipse");break;case"lineShortcut":ga[g]=s("shapes","line");break;case"markerShortcut":ga[g]=s("marker");break;case"highlighterShortcut":ga[g]=s("highlighter");break;case"stampShortcut":ga[g]=s("stamps");break;case"pixelateShortcut":ga[g]=s("pixelate");break;case"cropShortcut":ga[g]=s("crop")}if(f.indexOf("91")>-1){var h=JSON.parse(JSON.stringify(f));/windows/i.test(window.navigator.userAgent)?(h[f.indexOf("91")]="17",h.sort(function(a,b){return a-b}),ga[h.join(" + ")]=ga[g],delete ga[g],d[h.join(" + ")]=d[g],delete d[g],ha[e]&&(ha[e][0]=h.join(" + ")),ia[e]&&(ia[e][0]=h.join(" + "))):(h[f.indexOf("91")]="93",h.sort(function(a,b){return a-b}),ga[h.join(" + ")]=ga[g],d[h.join(" + ")]=d[g],ha[e]&&ha[e].push(h.join(" + ")),ia[e]&&ia[e].push(h.join(" + ")))}}Browser.addKeyboardHandlers(d),$&&$.parentNode&&Browser.sendToExtension({name:"bounce",message:{name:"gt_setKeyboardHandlers",handlers:ha,enabled:fa}}),c&&"function"==typeof c&&c()}function v(a,b,c){fa=a.keyboardShortcutsEnabled,Browser.sendToExtension({name:"bounce",message:{name:"gt_setKeyboardHandlers",enabled:fa}}),Browser.sendToExtension({name:"bounce",message:{name:"op_setKeyboardHandlers",enabled:fa}}),c&&"function"==typeof c&&c()}function w(a,b,c){ba=Markup({allowZoom:!1,container:document.body,document:a.data,margin:0,enableToolbar:!1,fullScreen:!0,success:function(){if(document.documentElement.classList.add("skitchReady"),/^frameset$/i.test(document.body.nodeName)){var a=document.body.parentElement;a.appendChild(ba.dom),a.appendChild(document.getElementById("en-markup-disabled"))}ba.toast(Browser.i18n.getMessage("screenshotToast")),Browser.sendToExtension({name:"bounce",message:{name:"skitchSurfaceReady"}})}}),ba.on("toolStarted",function(a){Browser.sendToExtension({name:"trackEvent",category:"Skitch",action:a})}),ba.on("toolStopped",function(a){"crop"===a&&$.style.removeProperty("display")}),ba.localize({CROP_APPLY_TEXT:Browser.i18n.getMessage("apply"),CROP_CANCEL_TEXT:Browser.i18n.getMessage("regForm_cancel"),MARKUP_STAMP_APPROVED_TEXT:Browser.i18n.getMessage("approved"),MARKUP_STAMP_EXCLAIM_TEXT:Browser.i18n.getMessage("wow"),MARKUP_STAMP_PERFECT_TEXT:Browser.i18n.getMessage("perfect"),MARKUP_STAMP_QUESTION_TEXT:Browser.i18n.getMessage("what"),MARKUP_STAMP_REJECTED_TEXT:Browser.i18n.getMessage("rejected"),ZOOM_RESET_TEXT:Browser.i18n.getMessage("reset"),ZOOM_TIP_TEXT:Browser.i18n.getMessage("panInstruction")}),c&&"function"==typeof c&&c()}function x(a,c,d){if(Browser.sendToExtension({name:"tabStatusReply",alive:!0}),!T())return ka=[a,c,d],document.getElementById("evernoteLoading")||p(),void(d&&"function"==typeof d&&d());G(),$.classList.contains("evernoteClipperVisible")?f({notClipping:!0}):(clipResultCoordinator.hideClipResult(!1),b.lazyImagesLoad().then(function(){L(a)}).catch(function(b){log.error(b),L(a)})),d&&d(),Browser.setInterceptSpecialKeys(!0)}function y(a,b,c){"string"==typeof a.oldShortcut&&(a.oldShortcut=[a.oldShortcut],a.shortcut=[a.shortcut],a.shortcutName=[a.shortcutName]);for(var d=0;d<a.oldShortcut.length;d++){var e=a.oldShortcut[d].split("|").join(" + "),f=a.shortcut[d].split("|").join(" + ");ga[f]=ga[e],delete ga[e];var g={};["closeWebClipperShortcut","expandArticleShortcut","contractArticleShortcut","moveArticleUpShortcut","moveArticleDownShortcut"].indexOf(a.shortcutName[d])>-1?g[f]=n:g[f]=m,Browser.addKeyboardHandlers(g)}c&&"function"==typeof c&&c()}function z(){$&&($.removeEventListener(Browser.whichTransitionEnd(),z),$.parentNode&&$.parentNode.removeChild($)),ja=0}function A(a){"opacity"===a.propertyName&&(Browser.sendToExtension({name:"getOption",option:"defaultClipAction"}),$.removeEventListener(Browser.whichTransitionEnd(),A))}function B(a){/Mac OS X/.test(window.navigator.userAgent)?a.metaKey&&a.preventDefault():/Windows/.test(window.navigator.userAgent)&&a.ctrlKey&&a.preventDefault(),[8,13,27,39,37,65,70,66,83,77,80,69,67].indexOf(a.keyCode)>-1?document.documentElement.classList.contains("skitchReady")||document.documentElement.classList.contains("skitchWaiting")||a.preventDefault():9===a.keyCode&&$.focus()}function C(a){if(document.documentElement.classList.contains("skitchReady")&&!document.querySelector("textarea.skitch-tool-element-text-editor")){var b=ba.getElement().offsetWidth/2,c=ba.getElement().offsetHeight/2;Browser.sendToExtension({name:"bounce",message:{name:"gt_useSkitchTool",tool:"text",loc:{x:b,y:c},charCode:a.charCode}}),a.preventDefault()}}function D(a){$.classList.contains("evernoteClipperVisible")?a.target!==document.documentElement&&c.isPointOnVeil(a.pageX,a.pageY)&&a.preventDefault():document.documentElement.classList.contains("evernoteOptionsOpen")&&a.preventDefault()}function E(){Browser.sendToExtension({name:"showLoggedInOrOutState"})}function F(){ja++,ka.length>0&&T()&&(x(ka[0],ka[1],ka[2]),ka=[]),window.focus()}function G(){aa&&aa.parentNode&&aa.parentNode.removeChild(aa)}function H(){$.classList.contains("evernoteClipperVisible")&&Browser.sendToExtension({name:"bounce",message:{name:"gt_save"}})}function I(){$.classList.contains("evernoteClipperVisible")&&Browser.sendToExtension({name:"bounce",message:{name:"gt_toggleMinimizeClipper"}})}function J(a,b,c){document.documentElement.classList.contains("evernoteOptionsOpen")||($.style.setProperty("height",a.height+"px","important"),a.recalculate===!0&&Browser.sendToExtension({name:"bounce",message:{name:"gt_toggleSmallScreenMode"}}),c&&c())}function K(a,b,c){var d=a.height;a.height>window.innerHeight&&(d=window.innerHeight,Browser.sendToExtension({name:"bounce",message:{name:"op_setPinchHeight",totalHeight:window.innerHeight}})),_.style.setProperty("height",d+"px","important"),_.style.setProperty("top","calc(50% - "+d/2+"px)","important"),c&&"function"==typeof c&&c()}function L(a){if(a){Browser.sendToExtension({name:"main_recordActivity"}),da=a.bizUser,ea=a.bizComplete,Browser.sendToExtension({name:"bounce",message:{name:"gt_initialize",ssoRequired:da&&!ea,title:b.getTitle()}});var e=b.isCustomFormat();Browser.sendToExtension({name:"bounce",message:{name:"gt_setPossibleClipTypes",pageInfo:{pdf:b.getPdfUrl(),documentIsFrameset:b.documentIsFrameset,selection:!!b.getSelection(),gmail:b.isGmail(),gmailThread:b.isGmailThread(),custom:e?b.getCustomFormatSiteName(e.id):null},rememberButton:a.facebookRememberButton}}),ca=UUID.generateGuid(),Browser.sendToExtension({name:"getSmartFilingInfo",recText:b.getRecommendationText(!1),pendingNoteKey:ca,url:b.getUrl()}),c.clearHighlights({tag:"true",tagName:"highlight"}),a.facebookRememberButton&&c.setElement(d.selectedElement)}$.addEventListener(Browser.whichTransitionEnd(),A),$.classList.add("evernoteClipperVisible"),Browser.sendToExtension({name:"showOpenState"}),Browser.sendToExtension({name:"bounce",message:{name:"ttc_close",which:"gmailTooltip"}}),Browser.sendToExtension({name:"bounce",message:{name:"ttc_close",which:"googleInboxTooltip"}}),Browser.sendToExtension({name:"bounce",message:{name:"ttc_close",which:"pdfTooltip"}}),Browser.sendToExtension({name:"bounce",message:{name:"ttc_close",which:"customTooltip"}})}function M(){aa=document.createElement("div"),aa.id="evernoteLoading",document.body.appendChild(aa)}function N(a,b,d){_||(_=document.createElement("iframe"),_.id="evernoteOptionsPage",_.addEventListener("load",function(){Browser.sendToExtension({name:"bounce",message:{name:"op_setKeyboardHandlers",handlers:ia,enabled:fa}})}),_.src=Browser.extension.getURL("options.html#iframe")),document.documentElement.appendChild(_),document.documentElement.classList.add("evernoteOptionsOpen"),c.gray(),_.focus(),d&&"function"==typeof d&&d()}function O(a,b,c){new TooltipCoordinator(Browser.extension.getURL("content/tooltips/tooltip.html#authed=true&which=ssoInProgress"),"ssoInProgress","evernoteSSOProgress"),c&&"function"==typeof c&&c()}function P(d,e,g){function h(a,b){"screenshot"===d.clipType?d.screenshotUrl?a():ba.getFile(function(b){ba.destroy(),ba=null,a({bytes:b.bytes,byteLength:b.bytes.byteLength})}):"clearly"===d.clipType?clipper.clipClearly(a,b):"article"===d.clipType?clipper.clipArticle(!0,a,b):"fullPage"===d.clipType?clipper.clipFullPage(!0,a,b):"selection"===d.clipType?clipper.clipSelection(!0,d.selectionText,a,b):"url"===d.clipType?clipper.clipUrl(a):"pdf"===d.clipType?clipper.clipPdf(a):"email"===d.clipType?clipper.clipEmail(a,b):"image"===d.clipType?clipper.clipImage(d.imageUrl,a):"custom"===d.clipType&&clipper.clipCustom(a,b)}function i(){"custom"===d.clipType&&Browser.sendToExtension({name:"setPersistentValueForCurrentUser",key:b.getCustomFormatSiteName(b.isCustomFormat().id)+"UncheckedSections",value:c.getCustomElementUncheckedSections()})}f({notClipping:!1});var j=d.title;"string"!=typeof j&&(j=b.getTitle()),(j=a.removeControlCharacters(j).trim())||(j=Browser.i18n.getMessage("quickNote_untitledNote"));var k=b.getUrl(),l=null;d.contextMenu&&(l=b.getRecommendationText(!1)),clipResultCoordinator.showClipResult(ca,j,k,l,function(){i(),h(function(a){var b={name:"submitNote",title:j,notebook:d.notebook,tags:d.tags,comment:d.comment,clipType:d.clipType,url:k,hostname:document.location.hostname,userSelectedNotebook:d.userSelectedNotebook,pendingNoteKey:ca,smartFilingNotebookAvailable:d.smartFilingNotebookAvailable,changedSmartFilingNotebook:d.changedSmartFilingNotebook};"screenshot"===d.clipType?d.screenshotUrl?b.content='<img src="'+d.screenshotUrl+'"></img>':(b.content='<img src="resource:0"></img>',b.resources=[a]):b.content=a,Browser.sendToExtension(b),c.reset()},function(a){Browser.sendToExtension({name:"submitNote",clipType:d.clipType,error:a.message+" "+a.stack,pendingNoteKey:ca,smartFilingNotebookAvailable:d.smartFilingNotebookAvailable,changedSmartFilingNotebook:d.changedSmartFilingNotebook}),c.reset()})}),g&&"function"==typeof g&&g()}function Q(a){$.classList.contains("evernoteClipperVisible")&&!document.documentElement.classList.contains("skitchReady")&&Browser.sendToExtension({name:"bounce",message:{name:"gt_useClipType",clipType:a}})}function R(a,b){document.documentElement.classList.contains("skitchReady")&&Browser.sendToExtension({name:"bounce",message:{name:"gt_useSkitchTool",tool:a,subtool:b}})}function S(a,b){b&&(["INPUT","TEXTAREA"].indexOf(b.nodeName)>-1||"true"===b.contentEditable)||Browser.sendToExtension({name:"toggleClipper"},function(a){(a||chrome&&chrome.runtime&&chrome.runtime.lastError)&&setTimeout(function(){alert("The Clipper couldn't start on this page. Reload the page and try again. If that doesn't help, contact customer support.")},200)})}function T(){return 2===ja}function U(a,c,d){da===a.bizUser&&ea===a.bizComplete||(Browser.sendToExtension({name:"bounce",message:{name:"gt_updateUser",ssoRequired:a.bizUser&&!a.bizComplete}}),Browser.sendToExtension({name:"getSmartFilingInfo",recText:b.getRecommendationText(!1),pendingNoteKey:ca,url:b.getUrl()}),da=a.bizUser,ea=a.bizComplete),d&&"function"==typeof d&&d()}function V(a,b,c){ba.updateSelectedElementsColor(a.color),ba.useColor(a.color),Browser.sendToExtension({name:"trackEvent",category:"Skitch",action:"color",label:a.color}),c&&"function"==typeof c&&c()}function W(a,b,c){ba.useTool(a.tool),"crop"===a.tool?($.style.setProperty("display","none","important"),Browser.sendToExtension({name:"trackEvent",category:"Skitch",action:"crop"})):"text"===a.tool&&a.loc&&a.charCode&&ba.startActiveTool(a.loc,{value:String.fromCharCode(a.charCode),selectOnFocus:!1}),c&&"function"==typeof c&&c()}function X(){ba.zoom(1.1,{x:window.innerWidth/2,y:window.innerHeight/2}),Browser.sendToExtension({name:"trackEvent",category:"Skitch",action:"zoom_in"}),sendResponse&&"function"==typeof sendResponse&&sendResponse()}function Y(){ba.zoom(1/1.1,{x:window.innerWidth/2,y:window.innerHeight/2}),Browser.sendToExtension({name:"trackEvent",category:"Skitch",action:"zoom_out"}),sendResponse&&"function"==typeof sendResponse&&sendResponse()}function Z(a,b,c){Browser.sendToExtension({name:"isAlive",message:{name:"coordinator"}}),c&&"function"==typeof c&&c()}var $,_,aa,ba,ca,da,ea,fa=!0,ga={},ha={},ia={},ja=0,ka=[];this.msgHandlerToggleCoordinator=x,Browser.addMessageHandlers({contextIsAlive:Z,closeClipper:f,duplicateKeyboardShortcut:g,goToSkitchWaitingMode:h,hideOptions:o,isExtensionOpen:q,receiveKeyboardShortcuts:u,receiveKeyboardShortcutsEnabled:v,receiveScreenshot:w,setGlobalToolsHeight:J,setOptionsHeight:K,showOptions:N,showSSOProgressTooltip:O,startSubmission:P,toggleCoordinator:x,updateKeyboardShortcut:y,updateUserTier:U,skitch_useColor:V,skitch_useTool:W,skitch_zoomIn:X,skitch_zoomOut:Y}),function(){Browser.sendToExtension({name:"getKeyboardShortcuts",shortcuts:["startWebClipperShortcut"]}),$=document.createElement("iframe"),$.id="evernoteGlobalTools",$.addEventListener("load",function(){Browser.sendToExtension({name:"bounce",message:{name:"gt_setKeyboardHandlers",handlers:ha,enabled:fa}}),Browser.sendToExtension({name:"bounce",message:{name:"gt_getBrowserHeight",height:window.innerHeight}}),F()}),window.addEventListener("resize",function(){Browser.sendToExtension({name:"bounce",message:{name:"gt_getBrowserHeight",height:window.innerHeight}})}),$.src=Browser.extension.getURL("content/global_tools/global_tools.html")}(),Z()});