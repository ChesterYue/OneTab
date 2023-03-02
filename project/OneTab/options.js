/**
 * save input
 */
function save() {
    const obj = {
        inputUrlString: document.getElementById('textarea-urls').value,
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
        'inputUrlString',
        'notificationEnabled',
    ];
    chrome.storage.sync.get(keyList, function(obj) {
        console.log(`${JSON.stringify(obj)}`);
        document.getElementById('textarea-urls').value = obj['inputUrlString'] !== 'undefined' ? obj['inputUrlString'] : '';
        document.getElementById('checkbox-notification').checked = obj['notificationEnabled'] !== undefined ? obj['notificationEnabled'] : true;
    });
}
window.addEventListener('load', load);
