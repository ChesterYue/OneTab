/**
 * save input
 */
function save() {
    const obj = {
        inputUrlString: document.getElementById('urls').value,
        notificationChecked: document.getElementById('notification-checked').checked,
    };
    console.log(`save, ${JSON.stringify(obj)}`);
    chrome.storage.sync.set(obj, function() {
        alert('Options Saved');
    });
}
document.getElementById('save').addEventListener('click', save);


/**
 * load from storage
 */
function load() {
    const keyList = [
        'inputUrlString',
        'notificationChecked',
    ];
    chrome.storage.sync.get(keyList, function(obj) {
        console.log(`load, ${JSON.stringify(obj)}`);
        document.getElementById('urls').value = obj['inputUrlString'] !== undefined ? obj['inputUrlString'] : '';
        document.getElementById('notification-checked').checked = obj['notificationChecked'] !== undefined ? obj['notificationChecked'] : true;
    });
}
window.addEventListener('load', load);
