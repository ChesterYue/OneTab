/**
 * save input
 */
function save() {
    const inputUrls = document.getElementById('textarea-urls').value;
    const notificationEnabled = document.getElementById('checkbox-notification').checked;
    chrome.storage.sync.set({
        inputUrls: inputUrls,
        notificationEnabled: notificationEnabled,
    }, function() {
        alert('options saved');
    });
}
document.getElementById('button-save').addEventListener('click', save);


/**
 * load from storage
 */
function load() {
    chrome.storage.sync.get(['inputUrls', 'notificationEnabled'], function(obj) {
        const inputUrls = obj['inputUrls'];
        const notificationEnabled = obj['notificationEnabled'];
        document.getElementById('textarea-urls').value = inputUrls;
        document.getElementById('checkbox-notification').checked = notificationEnabled;
    });
}
window.addEventListener('load', load);
