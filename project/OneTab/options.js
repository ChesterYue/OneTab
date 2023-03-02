/**
 * save input
 */
function save() {
    const obj = {
        inputUrls: document.getElementById('textarea-urls').value,
        notificationEnabled: document.getElementById('checkbox-notification').checked,
    };
    chrome.storage.sync.set(obj, function() {
        alert('options saved');
    });
}
document.getElementById('button-save').addEventListener('click', save);


/**
 * load from storage
 */
function load() {
    const keyList = [
        'inputUrls',
        'notificationEnabled',
    ];
    chrome.storage.sync.get(keyList, function(obj) {
        document.getElementById('textarea-urls').value = obj['inputUrls'];
        document.getElementById('checkbox-notification').checked = obj['notificationEnabled'];
    });
}
window.addEventListener('load', load);
