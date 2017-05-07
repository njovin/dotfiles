var isNotfirstRun = (localStorage['sks_firstRun'] == 'true');
if (!isNotfirstRun) {
    localStorage['sks_firstRun'] = 'true';
    _gaq.push(['_trackEvent', 'Install', 'Installed']);
}