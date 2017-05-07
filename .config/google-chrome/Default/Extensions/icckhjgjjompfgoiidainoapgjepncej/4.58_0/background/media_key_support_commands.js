(function() {
  document.addEventListener('DOMContentLoaded', function() {
    return chrome.commands.onCommand.addListener(function(command) {
      console.log('Command: ', command);
      if (command === 'pause') {
        return sendAction('pause');
      } else if (command === 'next') {
        return sendAction('next');
      } else if (command === 'stop') {
        return sendAction('stop');
      } else if (command === 'previous') {
        return sendAction('previous');
      } else if (command === 'thumbsUp') {
        return sendAction('thumbsUp');
      } else if (command === 'thumbsDown') {
        return sendAction('thumbsDown');
      } else if (command === 'favorite') {
        return sendAction('favorite');
      }
    });
  });

  window.useMediaKeys = function() {
    return null;
  };

}).call(this);
