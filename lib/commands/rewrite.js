var _ = require('lodash');
var _deep = require('lodash-deep');
var path = require('path');
var glob = require('glob');
var UrlHelper = require('./../util/url_helper');
var FileNameHelper = require('./../util/file_name_helper');
var TabletopNameHelper = require('./../util/tabletop_name_helper');
var JsonLoader = require('./../util/json_loader');

var localFileNameForUrl = function (url, options, modFilePath) {
    if (options.recovering) {
        var directory = path.dirname(modFilePath);
        var matching = glob.sync(directory + "/" + TabletopNameHelper.baseFileNameForUrl(url) + ".*");
        if (matching.length === 0) {
            return "file_was_missing_locally";
        }
        return path.basename(matching[0]);
    }
    else {
        return UrlHelper.fileNameForUrl(url);
    }
};

var rewrite = function (modFilePath, options) {
    var baseUrl = options.rewriteBaseUrl;
    if (!baseUrl) {
        console.error("rewriteBaseUrl is required to rewrite a mod file");
        process.exit(1);
    }

    console.log("rewriting %s with base url: %s", modFilePath, baseUrl);
    var modObject = JsonLoader.read(modFilePath);

    const originalSaveNameKey = '__OriginalSaveName';
    var gameSaveName = modObject[originalSaveNameKey] || modObject.SaveName;
    modObject[originalSaveNameKey] = modObject[originalSaveNameKey] || modObject.SaveName;
    modObject.SaveName = modObject[originalSaveNameKey] + " Backup";
    modObject = _deep.deepMapValues(modObject, function (value, key) {
        if (!UrlHelper.isUrl(value)) {
            return value;
        }
        const localFileName = localFileNameForUrl(value, options, modFilePath);
        return encodeURI(baseUrl + "/" + FileNameHelper.safe(gameSaveName) + "/" + localFileName) + "?dl=1";
    });

    JsonLoader.write(modFilePath, modObject);
};

module.exports = {
    rewrite: rewrite
};