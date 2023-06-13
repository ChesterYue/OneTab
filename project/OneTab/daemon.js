/**
 * onSendHeadersCallback
 *
 * @param {object} details
 */
function onSendHeadersCallback(details) {
    console.log(`details:${JSON.stringify(details)}`);

    // feature 0: restrict url with configured domain
    restrictUrl(details);

    // feature 1: extract url from input
    extractUrl(details);
}
const onSendHeadersFilter = {urls: ['<all_urls>']};
chrome.webRequest.onSendHeaders.addListener(onSendHeadersCallback, onSendHeadersFilter);



// restrict url

/**
 * read storage
 *
 * @param {object} details
 */
function restrictUrl(details) {
    readStorage('restrict', function(restrict) {
        const urlString = restrict.urlString;
        const notificationChecked = restrict.notificationChecked;
        if (urlString === undefined) {
            console.log(`urlString === undefined`);
            return;
        }
        const inputUrlList = urlString.split('\n').map((url) => url.trim());
        // console.log(`inputUrlList:${inputUrlList}`);

        for (inputUrl of inputUrlList) {
            if (inputUrl.length === 0) {
                continue;
            }

            const matchResult = matchUrlRestrict(details.url, inputUrl);
            if (!matchResult) {
                continue
            }

            queryTab(details, inputUrl, function success(details, tabId) {
                if (details.tabId === -1) { // js background send trigger onSendHeaders, example: https://unbug.github.io/codelf/#test
                    return;
                }

                updateTab(details.url, tabId);
                removeTab(details.tabId);
                if (notificationChecked) {
                    createNotification(details.url);
                }
            });
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
function matchUrlRestrict(detailsUrl, inputUrl) {
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
 * @param {string} url
 * @param {function} success
 */
function queryTab(details, url, success) {
    console.log(`queryTab`);

    if (url.slice(-1) !== '/') {
        url = url + '/';
    }
    const queryOptions = {
        url: url + '*',
        currentWindow: true,
    };
    console.log(`queryOptions: ${JSON.stringify(queryOptions)}`);

    console.log(`${chrome.tabs}`);

    chrome.tabs.query(queryOptions, function(tabList) {
        if (typeof tabList === 'undefined') {
            console.log(`typeof tabList === 'undefined`);
            return;
        }

        if (tabList.length === 0) {
            console.log(`tabList.length === 0`);
            return;
        }

        if (tabList[0].id === details.tabId) {
            console.log(`tabList.length === 0`);
            return;
        }

        success(details, tabList[0].id);
    });
}


// extract url
/**
 * read storage
 *
 * @param {object} details
 */
function extractUrl(details) {
    console.log(`extractUrl: ${details.url}`);
    readStorage('extract', function(extract) {
        const urlRegexpString = extract.urlRegexpString;
        if (urlRegexpString === undefined) {
            console.log(`urlRegexpString === undefined`);
            return;
        }
        const inputRegexList = urlRegexpString.split('\n').map((url) => url.trim());

        for (inputRegex of inputRegexList) {
            if (inputRegex.length === 0) {
                continue;
            }

            const urlExtracted = matchUrlExtract(details.url, inputRegex);
            if (urlExtracted === undefined) {
                continue;
            }
            console.log(`urlExtracted: ${urlExtracted}`);
            console.log(`details.tabId: ${details.tabId}`);

            updateTab(urlExtracted, details.tabId);

            break;
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
function matchUrlExtract(detailsUrl, inputRegex) {
    console.log(`matchUrlExtract ${detailsUrl} ${inputRegex}`);

    if (inputRegex.length === 0) {
        return undefined;
    }

    const regex = new RegExp(inputRegex, 'i');
    const matchResult = detailsUrl.match(regex);
    if (matchResult === null) {
        return undefined
    }

    if (matchResult.length < 2) {
        return undefined
    }

    const url = unescape(matchResult[1]);
    return url;
}


// helper


/**
 * read storage
 *
 * @param {string} key
 * @param {function} callback
 */
function readStorage(key, callback) {
    chrome.storage.sync.get([key], function(obj) {
        if (typeof obj === 'undefined') {
            console.log(`typeof obj === 'undefined`);
            return;
        }

        if (typeof obj[key] === 'undefined') {
            console.log(`typeof obj[${key}] === 'undefined`);
            return;
        }

        callback(obj[key]);
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
    if (tabId === -1) {
        return;
    }
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
    if (tabId === -1) {
        return;
    }
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
