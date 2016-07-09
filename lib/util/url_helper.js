var _ = require('lodash');
var _deep = require('lodash-deep');

module.exports = class UrlHelper {
    static removeSpecialSuffixesOnUrl(value) {
        _.each(["?dl=1", "{Unique}"], function (suffix) {
            if (_.endsWith(value, suffix)) {
                value = value.substring(0, value.length - suffix.length);
            }
        });
        return value;
    };

    static fileNameForUrl(url) {
        let extensionRegex = /^(.*)\.([A-Za-z]{3,4})$/;
        var cleanedOutputName = UrlHelper.removeSpecialSuffixesOnUrl(url).replace(/[:\/\?=!#]/g, '');
        if (extensionRegex.test(cleanedOutputName)) {
            var matches = extensionRegex.exec(cleanedOutputName);
            var prefix = matches[1];
            var extension = matches[2];
            cleanedOutputName = prefix.replace(/\./g, '') + '.' + extension;
        }
        else {
            cleanedOutputName = cleanedOutputName.replace(/\./g, '');
        }
        return UrlHelper.removeSpecialSuffixesOnUrl(cleanedOutputName);
    };

    static isUrl(value) {
        return _.startsWith(value, 'http');
    };

    static getUniqueUrlsInObject(object) {
        var urls = [];
        _deep.deepMapValues(object, function (value) {
            if (UrlHelper.isUrl(value)) {
                urls.push(UrlHelper.removeSpecialSuffixesOnUrl(value));
            }
        });
        return _.uniq(urls);
    };
};