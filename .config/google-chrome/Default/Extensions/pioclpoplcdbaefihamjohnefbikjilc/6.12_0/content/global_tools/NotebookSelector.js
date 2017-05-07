/*! Copyright 2009-2017 Evernote Corporation. All rights reserved. */

function NotebookSelector(a,b,c,d,e){"use strict";function f(){return ja.value.trim()}function g(){if(R){var a=f();if(""!==a){EDGE&&document.activeElement.blur(),na.disabled=!0,B(!1);var b=R===GlobalUtils.ACCOUNT_SELECTOR_PERSONAL;if(h(a,b===!0?null:3))L({error:Browser.i18n.getMessage("Error_Create_Notebook_ExistingName")});else{e({name:a,personalNotebook:b})}}}}function h(a,b){for(var c=a.toLowerCase(),d=o(),e=0;e<d.length;e++){var f=d[e];if(c===f.name.toLowerCase()&&(f.type===b||!f.type&&!b))return!0}return!1}function i(){ja.placeholder=Browser.i18n.getMessage("createNewNotebook"),ka.classList.add("hide"),ja.value="",na.disabled=!1,K()}function j(){ka.classList.contains("hide")&&(Browser.sendToExtension({name:"trackEvent",category:"notebooks",action:"add_notebook"}),ja.placeholder=Browser.i18n.getMessage("enterName"),ka.classList.remove("hide"),setHeight())}function k(a){log.log("Generate notebooks list"),B(!1),d()}function l(a){var b=a.published||a.shared;return!(document.body.classList.contains("email")&&b)}function m(a){if(!oa&&0===a.notebooks.length&&a.exception?(da.classList.remove("hide"),ea.innerText=a.exception.msg):da.classList.add("hide"),a.exception){if(oa)return K(a.exception.msg),void B(!0)}else K();oa=a,q()}function n(a){S=a,q()}function o(){var a=[];if(!oa)return a;for(var b=0,c=oa.notebooks.length;b<c;b++){var d=oa.notebooks[b];d.accountSelector==R&&a.push(d)}return a}function p(){oa=null}function q(){if(oa){F();var a=!1,b=null,c=1e3,d=(oa.account||{})[R]||{},e=S?S[R]:{};if(o().forEach(function(f){var g=r(f);pa&&pa===f.guid&&(a=!0,H(g)),oa.createdNotebookGuid&&f.guid===oa.createdNotebookGuid&&c>10?(pa=oa.createdNotebookGuid,oa.optionSelectedNotebook=f,c=10):d.alwaysStartInNotebookGuid&&f.guid===d.alwaysStartInNotebookGuid&&c>20?(oa.optionSelectedNotebook=f,c=20):e.notebook&&f.guid===e.notebook.guid&&c>30?(oa.smartFilingNotebook=f,oa.optionSelectedNotebook=f,c=30):f.guid===d.recentNotebookGuid&&c>40?(oa.recentNotebook=f,d.alwaysStartInNotebookGuid||(oa.optionSelectedNotebook=f,c=40)):!d.alwaysStartInNotebookGuid&&!d.recentNotebookGuid&&f.defaultNotebook&&c>50?(oa.optionSelectedNotebook=f,c=50):c>100&&(oa.optionSelectedNotebook=f,c=100),oa.optionSelectedNotebook&&f.guid===oa.optionSelectedNotebook.guid&&l(f)&&(b=g)},this),!a)if(b)H(b);else{console.error("Notebook does not exist. Selecting default notebook"),pa=null;for(var f=Z.getElementsByClassName("nbNotebook"),g=0,h=f.length;g<h;g++)if(null!==f[g].getAttribute("default")){H(f[g]);break}}B(!0)}}function r(a){var c=document.createElement("div");c.classList.add("nbNotebook");var d=document.createElement("span");d.innerText=a.name;for(var e=a.name.split(/\s+/),f=0;f<e.length;f++)T.insert(e[f],c),CommonSelector.SPECIAL_CHAR_REGEX.test(e[f])&&T.insert(e[f].replace(CommonSelector.SPECIAL_CHAR_REGEX,""),c);if(c.appendChild(d),a.owner){var g=document.createElement("span");g.classList.add("nbNotebookOwner"),g.innerText=" ("+a.owner+")",c.appendChild(g)}return a.type===GlobalUtils.NOTEBOOK_TYPE_LINKED?(c.classList.add("nbLinkedNotebook"),c.setAttribute("globalId",a.globalId),c.setAttribute("shardId",a.shardId),a.noteStoreUrl&&c.setAttribute("noteStoreUrl",encodeURIComponent(a.noteStoreUrl))):a.type===GlobalUtils.NOTEBOOK_TYPE_BUSINESS&&c.classList.add("nbBusinessNotebook"),J(c),C(c)||c.classList.add("nbHidden"),a.noShareNotes&&c.setAttribute("noShareNotes",""),c.addEventListener("click",function(){H(this),pa=this.getAttribute("guid"),b({userSelected:!0}),I()}),c.addEventListener("mouseover",function(){for(var a=Z.querySelectorAll(".nbHover"),b=0;b<a.length;b++)a[b].classList.remove("nbHover");this.classList.add("nbHover")}),c.title=c.innerText,c.setAttribute("guid",a.guid),a.defaultNotebook&&c.setAttribute("default",""),A(c,a.stack),c}function s(a){var b=document.createElement("div");b.classList.add("nbStack");var c=document.createElement("h3");return c.innerText=a,c.title=c.innerText,b.appendChild(c),A(b),b}function t(a,b,c,d,e){for(var f=e-1,g=a.toLowerCase();d<=f;){for(var h=d+Math.floor((f-d)/2),i=c[h],j=0;j<(b?b.length:0);j++)i=i[b[j]];if(g<i.innerText.toLowerCase())f=h-1;else{if(!(g>i.innerText.toLowerCase()))return h;d=h+1}}return-1}function u(){return a.classList.contains("nbOpen")}function v(){var b=a.classList.contains("nbOpen");return a.classList.remove("nbOpen"),Y.value="",G(),c(),b}function w(b){return a.contains(b)}function x(a){for(var b=0;b<Z.children.length;b++)if(Z.children[b].classList.contains("nbNotebook")){if(Z.children[b].getAttribute("guid")===a)return Z.children[b]}else if(Z.children[b].classList.contains("nbStack"))for(var c=0;c<Z.children[b].children.length;c++)if(Z.children[b].children[c].getAttribute("guid")===a)return Z.children[b].children[c];return null}function y(){var a=GlobalUtils.NOTEBOOK_TYPE_PERSONAL;return V.classList.contains("nbSelectedLinked")?a=GlobalUtils.NOTEBOOK_TYPE_LINKED:V.classList.contains("nbSelectedBusiness")&&(a=GlobalUtils.NOTEBOOK_TYPE_BUSINESS),{defaultNotebook:V.hasAttribute("default"),globalId:V.getAttribute("globalId"),guid:V.getAttribute("guid"),name:V.innerText,noteStoreUrl:V.getAttribute("noteStoreUrl"),noShareNotes:V.hasAttribute("noShareNotes"),shardId:V.getAttribute("shardId"),type:a}}function z(a){if(13===a.keyCode){var c=Z.querySelector(".nbHover");c&&(H(c),pa=c.getAttribute("guid"),b({userSelected:!0}),I())}}function A(a,b){function c(a){return a.classList.contains("nbStack")?a.firstElementChild.innerText:a.classList.contains("nbNotebook")?a.innerText:void 0}var d=Z;if(b){var e=Z.querySelectorAll(".nbStack");d=e[t(b,["firstElementChild"],e,0,e.length)]||Z,d===Z&&(d=s(b))}b?CommonSelector.binaryInsert(d,c,a,1):CommonSelector.binaryInsert(d,c,a)}function B(a){a?(V.classList.remove("nbLoading"),ha.classList.remove("rotating")):(V.classList.add("nbLoading"),ha.classList.add("rotating"))}function C(a){for(var b=0;b<U.length;b++)if(U[b].indexOf(a)<0)return!1;return!0}function D(a){function b(a,c){var d=a[c];return d&&d.classList.contains("nbStack")?d="nextElementSibling"===c?d.children[1]:d.lastElementChild:d&&d.parentNode.classList.contains("nbStack")&&d===d.parentNode.children[0]?d=b(d.parentNode,c):!d&&a.parentNode.classList.contains("nbStack")&&(d=b(a.parentNode,c)),d}if(38===a.keyCode||40===a.keyCode){var c=38===a.keyCode?"previousElementSibling":"nextElementSibling",d=Z.querySelector(".nbHover")||Q;if(d){for(var e=b(d,c);e&&e.classList.contains("nbHidden");)e=b(e,c);e&&!e.classList.contains("nbHidden")&&(d.classList.remove("nbHover"),e.classList.add("nbHover"),e.scrollIntoViewIfNeeded?e.scrollIntoViewIfNeeded():e.scrollIntoView())}a.preventDefault()}}function E(){a.classList.add("nbOpen"),Y.focus(),setTimeout(function(){Q&&(Q.scrollIntoViewIfNeeded?Q.scrollIntoViewIfNeeded():Q.scrollIntoView())},50),c()}function F(){Q=null,T=new Trie,U=[],Y.value="",Z.innerHTML=""}function G(){for(var a=Z.querySelectorAll(".nbNotebook.nbHover"),b=0;b<a.length;b++)a[b].classList.remove("nbHover");var c=Y.value.trim();if(c){c=c.split(/\s+/),U=[];for(var b=0;b<c.length;b++){for(var d=T.getMatching(c[b]),e=[],f=0;f<d.length;f++)e=e.concat(d[f][1]);U.push(e)}for(var g=Z.querySelectorAll(".nbNotebook"),b=0;b<g.length;b++)C(g[b])?g[b].classList.remove("nbHidden"):g[b].classList.add("nbHidden");Z.classList.add("nbSearchOn");var h=Z.querySelector(".nbNotebook:not(.nbHidden)");h&&h.classList.add("nbHover")}else{for(var i=Z.querySelectorAll(".nbHidden"),b=0;b<i.length;b++)i[b].classList.remove("nbHidden");Z.classList.remove("nbSearchOn")}}function H(a){Q&&Q.classList.remove("nbSelectedNotebook"),a.classList.add("nbSelectedNotebook"),Q=a,V.innerText=a.innerText,V.title=V.innerText,V.setAttribute("guid",Q.getAttribute("guid")),Q.classList.contains("nbBusinessNotebook")?(V.classList.remove("nbSelectedLinked"),V.classList.add("nbSelectedBusiness"),V.removeAttribute("globalId"),V.removeAttribute("shardId"),V.removeAttribute("noteStoreUrl"),b({notebookType:GlobalUtils.NOTEBOOK_TYPE_BUSINESS})):Q.classList.contains("nbLinkedNotebook")?(V.classList.remove("nbSelectedBusiness"),V.classList.add("nbSelectedLinked"),V.setAttribute("globalId",Q.getAttribute("globalId")),V.setAttribute("shardId",Q.getAttribute("shardId")),V.setAttribute("noteStoreUrl",Q.getAttribute("noteStoreUrl")),b({notebookType:GlobalUtils.NOTEBOOK_TYPE_LINKED})):(V.classList.remove("nbSelectedBusiness"),V.classList.remove("nbSelectedLinked"),V.removeAttribute("globalId"),V.removeAttribute("shardId"),V.removeAttribute("noteStoreUrl"),b({notebookType:GlobalUtils.NOTEBOOK_TYPE_PERSONAL})),Q.hasAttribute("noShareNotes")?V.setAttribute("noShareNotes",""):V.removeAttribute("noShareNotes"),Q.hasAttribute("default")?V.setAttribute("default",""):V.removeAttribute("default")}function I(){a.classList.contains("nbOpen")?(i(),v()):E(),setHeight(!0)}function J(a){var b=Y.value.trim();if(b){b=b.split(/\s+/);for(var c=0;c<b.length;c++)new RegExp("(?:\\s|^)"+b[c],"i").test(a.firstElementChild.innerText)&&(U[c]||U.push([]),U[c].push(a))}}function K(a){ga.innerText=a||"",a?fa.classList.remove("hide"):fa.classList.add("hide"),setHeight()}function L(a){B(!0),a.error?(K(a.error),na.disabled=!1):a.result?(i(),I(),d()):Log.error("create notebook error: "+JSON.stringify(a))}function M(){return oa}function N(){return pa}function O(a){pa=a}function P(a){R=a,q()}var Q,R=null,S=null,T=new Trie,U=[],V=document.createElement("div"),W=document.createElement("div"),X=document.createElement("div"),Y=document.createElement("input"),Z=document.createElement("div"),$=document.createElement("div"),_=document.createElement("div"),aa=document.createElement("hr"),ba=document.createElement("span"),ca=document.createElement("span"),da=document.createElement("div"),ea=document.createElement("div"),fa=document.createElement("div"),ga=document.createElement("span"),ha=document.createElement("div"),ia=document.createElement("div"),ja=document.createElement("input"),ka=document.createElement("div"),la=document.createElement("div"),ma=document.createElement("button"),na=document.createElement("button"),oa=null,pa=null;a.classList.add("nbContainer"),V.classList.add("nbSelected"),W.classList.add("nbDropdown"),Y.classList.add("nbSearchInput"),_.classList.add("nbRefreshNotebooksInfoBlock"),aa.classList.add("nbRefreshNotebooksLine"),ba.classList.add("nbRefreshNotebooksInfo"),da.classList.add("nbGlobalErrorBlock"),da.classList.add("hide"),ea.classList.add("globalErrorBlockInfo"),ha.classList.add("nbRefreshNotebooksInfoBlockIcon"),ha.classList.add("useSvg"),ca.classList.add("nbRefreshNotebooksRefresh"),fa.classList.add("notebooksErrorBlock"),fa.classList.add("hide"),Z.classList.add("nbList"),$.classList.add("nbInputFocuser"),ia.classList.add("nbAddNotebookBlock"),ja.classList.add("nbCreateNewNotebookInput"),ja.classList.add("useSvg"),ja.placeholder=Browser.i18n.getMessage("createNewNotebook"),ka.classList.add("nbCreateNewNotebookElementsBlock"),ka.classList.add("hide"),la.classList.add("nbCreateNewNotebookButtons"),ma.classList.add("nbCreateNewNotebookCancelButton"),na.classList.add("nbCreateNewNotebookCreateButton"),Y.placeholder=Browser.i18n.getMessage("findANotebook"),Y.tabIndex=2,$.tabIndex=1,ba.innerHTML=Browser.i18n.getMessage("cantFindIt"),ca.innerHTML=Browser.i18n.getMessage("refreshList"),_.appendChild(aa),_.appendChild(ba),_.appendChild(ha),_.appendChild(ca),da.appendChild(ea),fa.appendChild(ga),ma.innerHTML=Browser.i18n.getMessage("regForm_cancel"),na.innerHTML=Browser.i18n.getMessage("create"),a.appendChild(da),a.appendChild(V),X.appendChild(Y),X.appendChild(fa),X.appendChild(ia),ia.appendChild(ja),ia.appendChild(ka),ka.appendChild(la),la.appendChild(ma),la.appendChild(na),W.appendChild(X),W.appendChild(Z),W.appendChild(_),a.appendChild(W),a.appendChild($),SAFARI&&SAFARI_VERSION<600&&changeSvgToPng(),ca.addEventListener("click",function(a){a.stopPropagation(),log.log("Refresh notebooks list"),Browser.sendToExtension({name:"trackEvent",category:"notebooks",action:"refresh"}),k(),Y.focus()}),da.addEventListener("click",function(a){a.stopPropagation(),log.log("Refresh notebooks list"),da.classList.add("hide"),k(),Y.focus()}),ja.addEventListener("focus",function(a){a.stopPropagation(),j()}),ja.addEventListener("click",function(a){a.stopPropagation()}),ja.addEventListener("keyup",function(a){a.stopPropagation(),a.preventDefault(),13===a.keyCode&&g()}),ma.addEventListener("click",function(a){a.stopPropagation(),i()}),na.addEventListener("click",function(a){g(),a.stopPropagation()}),V.addEventListener("click",function(a){I(),a.stopPropagation()}),Y.addEventListener("click",function(a){a.stopPropagation(),i()}),Y.addEventListener("input",function(){G(),setHeight()}),Y.addEventListener("keydown",D),Y.addEventListener("keyup",z),$.addEventListener("focus",E),Z.addEventListener("mousewheel",Browser.overrideScroll,!0),B(!1),this.clearNotebooksData=p,this.setSelectedAccount=P,this.getNotebooksData=M,this.getCreateNewNotebookValue=f,this.addNotebooks=m,this.saveNewNotebook=g,this.close=v,this.contains=w,this.findNotebookByGuid=x,this.getSelected=y,this.markStatus=B,this.open=E,this.reset=F,this.select=H,this.getUserSelectedNotebookGuid=N,this.setUserSelectedNotebookGuid=O,this.isOpened=u,this.hideCreateNewNotebookBlock=i,this.receiveNotebookCreationResult=L,this.setSmartFilingInfo=n,this.__defineGetter__("height",function(){return W.offsetTop+W.offsetHeight}),Object.preventExtensions(this)}Object.preventExtensions(NotebookSelector);