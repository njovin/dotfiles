/*! Copyright 2009-2017 Evernote Corporation. All rights reserved. */

"use strict";function msgHandlerReceiveRelatedNotes(a,b,c){document.getElementsByClassName("branding")[0].href=baseUrl+"/Home.action";for(var d in a.relatedNotes){var e=a.relatedNotes[d],f=document.createElement("div");f.classList.add("noteSectionNotes");var g=document.createElement("div");g.classList.add("noteSectionTitle");var h,i;"Google"===a.searchEngine?e[0].inBusinessNotebook||"expert"===e[0].type?(h=document.getElementById("library"),i="searchHelperTopBizLibraryMatches"):(h=document.getElementById("account"),i=a.tokens.biz?"searchHelperTopMatchesBiz":"searchHelperTopMatchesPers"):(h=document.getElementById("all"),i="searchHelperTopMatchesPers"),1===e.length&&(i+="One"),g.textContent=Browser.i18n.getMessage(i,[e.length.toString()]),h.innerHTML="",h.appendChild(g),h.appendChild(f);new NoteSnippets(f,baseUrl,userId,shardId,a.tokens,null,!0,function(a,b){b?Browser.sendToExtension({name:"trackEvent",category:"Simsearch",action:"view_related_notes",label:"expert",value:totalNumNotes}):a?Browser.sendToExtension({name:"trackEvent",category:"Simsearch",action:"view_related_notes",label:"business",value:totalNumNotes}):Browser.sendToExtension({name:"trackEvent",category:"Simsearch",action:"view_related_notes",label:"personal",value:totalNumNotes})}).renderBlocks(e),totalNumNotes+=e.length}a.relatedNotes.length?Browser.sendToExtension({name:"getPersistentValue",key:"confirmedSimsearch"}):a.noSimsearchResultsShown?Browser.sendToExtension({name:"bounce",message:{name:"simSearch_sendHeight",height:0}}):(document.getElementById("noNotes").style.display="block",Browser.sendToExtension({name:"setPersistentValue",key:userId+"_noSimsearchResultsShown",value:!0}),Browser.sendToExtension({name:"bounce",message:{name:"simSearch_sendHeight",height:getWindowHeight()}})),c&&"function"==typeof c&&c()}function getWindowHeight(){return document.body.offsetHeight}function toggleCloseOptions(){"block"==document.querySelector("#closeOptions").style.display?document.querySelector("#closeOptions").style.display="none":document.querySelector("#closeOptions").style.display="block"}function dismiss(){Browser.sendToExtension({name:"bounce",message:{name:"simSearch_sendHeight",height:0}}),Browser.sendToExtension({name:"bounce",message:{name:"temporarilyDisableSimSearch"}})}function dismissForever(){dismiss(),Browser.sendToExtension({name:"main_setOption",options:{useSearchHelper:!1}})}function confirmSimsearch(){document.getElementById("featureInfo").classList.remove("visible"),Browser.sendToExtension({name:"setPersistentValueForCurrentUser",key:"confirmedSimsearch",value:!0}),Browser.sendToExtension({name:"bounce",message:{name:"simSearch_sendHeight",height:getWindowHeight()}})}function tellUserToLogin(a,b,c){document.querySelector("#simSearchNotes").innerHTML=Browser.i18n.getMessage("searchHelperLoginMessage",[encodeURI(baseUrl)+"/ClipperLogin.action"]),Browser.sendToExtension({name:"bounce",message:{name:"simSearch_sendHeight",height:85}}),c&&"function"==typeof c&&c()}function receivePersistentValue(a,b,c){if("confirmedSimsearch"===a.key)a.value&&a.value[a.currentUserId]||Browser.sendToExtension({name:"getPersistentValue",key:"sawSimsearchFle"}),Browser.sendToExtension({name:"bounce",message:{name:"simSearch_sendHeight",height:getWindowHeight()}});else if("sawSimsearchFle"===a.key)if(document.querySelector("#simSearchNotes").style.display="none",a.value&&a.value[a.currentUserId])document.querySelector("#simSearchNotes").style.display="block",document.getElementById("featureInfo").classList.add("visible"),Browser.sendToExtension({name:"trackEvent",category:"Simsearch",action:"feature_info",label:"feature_info_shown"}),Browser.sendToExtension({name:"bounce",message:{name:"simSearch_sendHeight",height:getWindowHeight()}});else{var d=document.getElementById("featureInfoPreview");document.getElementById("featureInfoPreview").classList.add("visible"),Browser.sendToExtension({name:"bounce",message:{name:"simSearch_sendHeight",height:d.offsetTop+d.offsetHeight}}),Browser.sendToExtension({name:"trackEvent",category:"Simsearch",action:"feature_info_fle",label:"feature_info_fle_shown"})}c&&"function"==typeof c&&c()}var baseUrl,locale,userId,shardId,totalNumNotes=0;window.addEventListener("DOMContentLoaded",function(){GlobalUtils.localize(document.body),document.getElementById("closeButton").addEventListener("click",toggleCloseOptions),document.getElementById("dismiss").addEventListener("click",dismiss),document.getElementById("dismissForever").addEventListener("click",dismissForever),document.getElementById("keepSimsearchOn").addEventListener("click",function(){Browser.sendToExtension({name:"trackEvent",category:"Simsearch",action:"feature_info",label:"always_show_clicked"}),Browser.sendToExtension({name:"main_recordActivity"}),confirmSimsearch(),Browser.sendToExtension({name:"main_setOption",options:{useSearchHelper:!0}})}),document.getElementById("disableSimsearch").addEventListener("click",function(){Browser.sendToExtension({name:"trackEvent",category:"Simsearch",action:"feature_info",label:"never_show_clicked"}),Browser.sendToExtension({name:"main_recordActivity"}),confirmSimsearch(),dismissForever()}),document.querySelector("#featureInfo .info").addEventListener("click",function(){Browser.sendToExtension({name:"trackEvent",category:"Simsearch",action:"feature_info",label:"whats_this_clicked"}),Browser.sendToExtension({name:"main_recordActivity"})}),document.querySelector("#featureInfoPreview .button").addEventListener("click",function(){document.querySelector("#simSearchNotes").style.display="block",Browser.sendToExtension({name:"main_recordActivity"}),Browser.sendToExtension({name:"trackEvent",category:"Simsearch",action:"feature_info_fle",label:"feature_info_fle_clicked"}),document.getElementById("featureInfoPreview").classList.remove("visible"),document.getElementById("featureInfo").classList.add("visible"),Browser.sendToExtension({name:"trackEvent",category:"Simsearch",action:"feature_info",label:"feature_info_shown"}),Browser.sendToExtension({name:"bounce",message:{name:"simSearch_sendHeight",height:getWindowHeight()}}),Browser.sendToExtension({name:"setPersistentValueForCurrentUser",key:"sawSimsearchFle",value:!0})});for(var a=decodeURI(document.location.href),b=/(locale|baseUrl|userId|shardId)=([^&]+)/g,c=b.exec(a);c;)"locale"===c[1]?locale=c[2]:"baseUrl"===c[1]?baseUrl=c[2]:"userId"===c[1]?userId=c[2]:"shardId"===c[1]&&(shardId=c[2]),c=b.exec(a);/china/i.test(locale)&&(document.querySelector(".branding span").className="china"),userId?(Browser.addMessageHandlers({receivePersistentValue:receivePersistentValue,simsearch_receiveRelatedNotes:msgHandlerReceiveRelatedNotes,tellUserToLogin:tellUserToLogin}),Browser.sendToExtension({name:"simSearch_getNotesRelatedToSearchQuery"})):tellUserToLogin()});