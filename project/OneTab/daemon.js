/**
 * onSendHeadersCallback
 *
 * @param {object} details
 */
function onSendHeadersCallback(details) {
    // console.log(`details:${JSON.stringify(details)}`);
    readStorage(details);
}
const onSendHeadersFilter = {urls: ['<all_urls>']};
chrome.webRequest.onSendHeaders.addListener(onSendHeadersCallback, onSendHeadersFilter);


/**
 * read storage
 *
 * @param {object} details
 */
function readStorage(details) {
    const keyList = [
        'inputUrlString',
        'notificationChecked',
    ];
    chrome.storage.sync.get(keyList, function(obj) {
        const inputUrlString = obj['inputUrlString'] !== undefined ? obj['inputUrlString'] : '';
        const notificationChecked = obj['notificationChecked'] !== undefined ? obj['notificationChecked'] : true;
        // console.log(`inputUrlString:${inputUrlString}, notificationChecked:${notificationChecked}`);

        const inputUrlList = inputUrlString.split('\n').map((url) => url.trim());
        // console.log(`inputUrlList:${inputUrlList}`);

        for (inputUrl of inputUrlList) {
            if (inputUrl.length === 0) {
                continue;
            }

            const matchResult = matchUrl(details.url, inputUrl);
            if (matchResult) {
                queryTab(details, inputUrl, function success(details, tabId) {
                    updateTab(details.url, tabId);
                    removeTab(details.tabId);
                    if (notificationChecked) {
                        createNotification(details.url);
                    }
                });
            }
        }
    });
}


/**
 * match url
 *
 * @param {string} detailsUrl
 * @param {string} inputUrl
 * @return {boolean} match result
 */
function matchUrl(detailsUrl, inputUrl) {
    if (inputUrl.length === 0) {
        return false;
    }

    const regex = new RegExp(inputUrl.replace(/\//g, '\\/') + '.*', 'g');
    if (!detailsUrl.match(regex)) {
        return false;
    }

    return true;
}


/**
 * query tab
 *
 * @param {string} details
 * @param {string} inputUrl
 * @param {function} success
 */
function queryTab(details, inputUrl, success) {
    if (inputUrl.slice(-1) !== '/') {
        inputUrl = inputUrl + '/';
    }
    const queryOptions = {
        url: inputUrl + '*',
        currentWindow: true,
    };
    chrome.tabs.query(queryOptions, function(tabList) {
        if (typeof tabList === 'undefined') {
            return;
        }

        if (tabList.length === 0) {
            return;
        }

        if (tabList[0].id === details.tabId) {
            return;
        }

        success(details, tabList[0].id);
    });
}


/**
 * update tab
 *
 * @param {string} url
 * @param {string} tabId
 */
function updateTab(url, tabId) {
    console.log(`updateTab, url:${url}, tabId:${tabId}`);
    chrome.tabs.update(tabId, {
        active: true,
        url: url,
    });
}


/**
 * remove tab
 *
 * @param {string} tabId
 */
function removeTab(tabId) {
    console.log(`removeTab, tabId:${tabId}`);
    chrome.tabs.remove(tabId);
}


/**
 * create notification
 *
 * @param {string} url
 */
function createNotification(url) {
    const notificationId = 'OneTabNotification';
    const options = {
        type: 'basic',
        iconUrl: '128.png',
        title: 'OneTab ',
        message: url,
        priority: 1,
    };
    console.log(`createNotification, options:${JSON.stringify(options)}`);
    chrome.notifications.create(notificationId, options);
}
