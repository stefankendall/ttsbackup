var _ = require('lodash');
var _deep = require('lodash-deep');

module.exports = class UrlHelper {
    static removeSpecialEncodingOnUrl(value) {
        var suffixes = ["?dl=1", "{Unique}"];
        _.each(suffixes, function (suffix) {
            if (_.endsWith(value, suffix)) {
                value = value.substring(0, value.length - suffix.length);
            }
        });
        return value;
    };

    static fileNameForUrl(url) {
        var cleanedOutputName = UrlHelper.removeSpecialEncodingOnUrl(url).replace(/[:\/\?=!#]/g, '');
        var extensionRegex = /^(.*)\.([A-Za-z]{3,4})$/;
        if (extensionRegex.test(cleanedOutputName)) {
            var matches = extensionRegex.exec(cleanedOutputName);
            var prefix = matches[1];
            var extension = matches[2];
            cleanedOutputName = prefix.replace(/\./g, '') + '.' + extension;
        }
        else {
            cleanedOutputName = cleanedOutputName.replace(/\./g, '');
        }
        return UrlHelper.removeSpecialEncodingOnUrl(cleanedOutputName);
    };

    static isUrl(value) {
        return _.startsWith(value, 'http');
    };

    static getUniqueUrlsInObject(object){
        var urls = [];
        _deep.deepMapValues(object, function (value) {
            if (UrlHelper.isUrl(value)) {
                urls.push(UrlHelper.removeSpecialEncodingOnUrl(value));
            }
        });
        return _.uniq(urls);
    };
};