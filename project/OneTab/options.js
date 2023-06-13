/**
 * save input
 */
function save() {
    const obj = {
        restrict: {
            urlString: document.getElementById('restrict-urls').value,
            notificationChecked: document.getElementById('restrict-notification-checked').checked,
        },
        extract: {
            urlRegexpString: document.getElementById('extract-url-regexps').value,
        }
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
        'restrict',
        'extract',
    ];
    chrome.storage.sync.get(keyList, function(obj) {
        console.log(`load, ${JSON.stringify(obj)}`);

        const restrict = obj['restrict'];
        if (restrict !== undefined) {
            if (restrict.urlString !== undefined) {
                document.getElementById('restrict-urls').value = restrict.urlString;
            }
            if (restrict.notificationChecked !== undefined) {
                document.getElementById('restrict-notification-checked').checked = restrict.notificationChecked;
            }
        }

        const extract = obj['extract'];
        if (extract !== undefined) {
            if (extract.urlRegexpString !== undefined) {
                document.getElementById('extract-url-regexps').value = extract.urlRegexpString;
            }
        }
    });
}
window.addEventListener('load', load);
