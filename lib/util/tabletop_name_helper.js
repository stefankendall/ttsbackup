module.exports = class TabletopNameHelper {
    static baseFileNameForUrl(url) {
        return url.replace(/[\.:/\?=_%]/g, '');
    }
};