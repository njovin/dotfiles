window.onload = function() {
  console.log("window loaded");
  chrome.fileSystem.chooseEntry({type: 'openDirectory'}, function(theEntry) {
    if (!theEntry) {
      console.log('No Directory selected.');
      chrome.app.window.current.call().close();
      chrome.app.window.current().onClosed(function(){
        console.log("closed window.onload");
      });
      return;
    }
    console.log(chrome.fileSystem.retainEntry(theEntry));
    chrome.storage.local.set({'chosenFile': chrome.fileSystem.retainEntry(theEntry)});
    chrome.app.window.current.call().close();
    chrome.app.window.current().onClosed(function() {
      console.log("closed window.onload");
    });
  });
};
