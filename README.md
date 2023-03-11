# OneTab

## Introduction

[Chrome extension](https://chrome.google.com/webstore/detail/onetab-multiple-urls-rest/aaldlnbbklgcjgjejkfjfefamglajcje).

Restrict opening tabs with the same domain name.

## Feature

When open a new URL which in your configured list:

* If there is a tab already opened with the same domain name. The tab will be refreshed to the new URL. Instead of the new URL open in another new tab.
* If there is no tab opened with the same domain name. The new URL will open in a new tab as usual.

## Option

By right click on the extension icon then click options, you can:

1. configure restricted URL list.
2. enable notification in options to show notification when this triggered.

## Change Log

### v2023.03.04.20

* [U] optimize options page;
* [F] fix redundant notifications;
* [F] fix daemon.js undefined bug;
* [F] fix js background trigger onSendHeader;

### v2023.03.03.04

* [A] support multiple domain config;
