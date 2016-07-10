var _ = require('lodash');
var _deep = require('lodash-deep');

module.exports = class UrlHelper {
    static ttsExtensions() {
        return ["{Unique}"]
    }

    static dropboxExtensions() {
        return ["?dl=1"]
    }

    static removeSuffixesOnUrl(value, suffixes) {
        _.each(suffixes, function (suffix) {
            if (_.endsWith(value, suffix)) {
                value = value.substring(0, value.length - suffix.length);
            }
        });
        return value;
    };

    static fileNameForUrl(url) {
        var name = UrlHelper.removeSuffixesOnUrl(url, _.union(UrlHelper.dropboxExtensions(), UrlHelper.ttsExtensions()));
        if (_.endsWith(name, '/')) {
            name = name.substring(0, url.length - 1);
        }
        name = name.substring(name.lastIndexOf('/') + 1);
        let extensionRegex = /^(.*)\.([A-Za-z]{3,4})$/;
        name = name.replace(/[:\?=!#]/g, '');
        if (extensionRegex.test(name)) {
            var matches = extensionRegex.exec(name);
            var prefix = matches[1];
            var extension = matches[2];
            name = prefix.replace(/\./g, '') + '.' + extension;
        }
        return decodeURIComponent(name);
    };

    static isUrl(value) {
        return _.startsWith(value, 'http');
    };

    static getUniqueUrlsInObject(object) {
        var urls = [];
        _deep.deepMapValues(object, function (value) {
            if (UrlHelper.isUrl(value)) {
                urls.push(UrlHelper.removeSuffixesOnUrl(value, UrlHelper.ttsExtensions()));
            }
        });
        return _.uniq(urls);
    };
};