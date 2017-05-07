if(window.location.pathname == '/app') {
    old_count = null;
    old_is_overdue = null;

    setInterval(function() {
        var today_count = document.getElementById('today_count');
        if(today_count) {
            var total_count = parseInt(today_count.innerHTML);
            var is_overdue = today_count.className.indexOf('overdue_count') != -1;

            if(total_count != old_count || is_overdue != old_is_overdue) {
                var data = {
                    'type': 'update_badge',
                    'total_count': total_count,
                    'is_overdue': is_overdue
                }

                chrome.extension.sendRequest(data, function() {});
                old_count = total_count;
                old_is_overdue = is_overdue;
            }
        }
    }, 1000);
}
