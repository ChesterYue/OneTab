# [OneTab Chrome Extension](https://chrome.google.com/webstore/detail/onetab-multiple-urls-rest/aaldlnbbklgcjgjejkfjfefamglajcje)

## Feature

### Restrict URL

When open a new URL which in your configured list:

* If there is a tab already opened with the same domain name. The tab will be refreshed to the new URL. Instead of the new URL open in another new tab.
* If there is no tab opened with the same domain name. The new URL will open in a new tab as usual.

### Extract URL

If the input to address bar is matched by regexps configured in options. The tab will open the url matched.

## Change Log

### v2023.06.13.23

* [A] extract url;

### v2023.03.04.20

* [U] optimize options page;
* [F] fix redundant notifications;
* [F] fix daemon.js undefined bug;
* [F] fix js background trigger onSendHeader;

### v2023.03.03.04

* [A] support multiple domain config;
