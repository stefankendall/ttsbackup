var _ = require('lodash');
var _deep = require('lodash-deep');

var removeSpecialEncodingOnUrl = function (value) {
    var suffixes = ["?dl=1", "{Unique}"];
    _.each(suffixes, function (suffix) {
        if (_.endsWith(value, suffix)) {
            value = value.substring(0, value.length - suffix.length);
        }
    });
    return value;
};

var fileNameForUrl = function (url) {
    var cleanedOutputName = removeSpecialEncodingOnUrl(url).replace(/[:\/\?=!#]/g, '');
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
    return removeSpecialEncodingOnUrl(cleanedOutputName);
};

var isUrl = function (value) {
    return _.startsWith(value, 'http');
};

var getUniqueUrlsInObject = function (object) {
    var urls = [];
    _deep.deepMapValues(object, function (value) {
        if (isUrl(value)) {
            urls.push(removeSpecialEncodingOnUrl(value));
        }
    });
    return _.uniq(urls);
};

module.exports = {
    fileNameForUrl: fileNameForUrl,
    isUrl: isUrl,
    getUniqueUrlsInObject: getUniqueUrlsInObject
};