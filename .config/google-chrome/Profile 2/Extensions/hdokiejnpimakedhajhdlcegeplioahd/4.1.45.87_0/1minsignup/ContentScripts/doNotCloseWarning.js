if(!document.getElementById("LastPassDoNotCloseOverlay")){var divElement=document.createElement("div");divElement.id="LastPassDoNotCloseOverlay",divElement.style.cssText="top: 0px; left: 0px; height: 40px; padding: 0px; width: 100%; position: fixed; z-index: 1000000099; visibility: visible;";var iframeElement=document.createElement("iframe");iframeElement.style.cssText="height: 40px; width: 100%; border: 0px;",iframeElement.scrolling="no",divElement.appendChild(iframeElement),document.body.insertBefore(divElement,document.body.firstChild),console.log("append"),divElement.onmouseover=function(e){"0px"===divElement.style.top?(divElement.style.top="auto",divElement.style.bottom="0px"):(divElement.style.top="0px",divElement.style.bottom="auto")}}