var _ = require('lodash');
var _deep = require('lodash-deep');
var UrlHelper = require('./../util/url_helper');
var FileNameHelper = require('./../util/file_name_helper');
var JsonLoader = require('./../util/json_loader');

var rewrite = function (filePath, options) {
    var baseUrl = options.rewriteBaseUrl;
    if (!baseUrl) {
        console.error("rewriteBaseUrl is required to rewrite a mod file");
        process.exit(1);
    }

    console.log("rewriting %s with base url: %s", filePath, baseUrl);
    var modObject = JsonLoader.read(filePath);

    const originalSaveNameKey = '__OriginalSaveName';
    var gameSaveName = modObject[originalSaveNameKey] || modObject.SaveName;
    modObject[originalSaveNameKey] = modObject[originalSaveNameKey] || modObject.SaveName;
    modObject.SaveName = modObject[originalSaveNameKey] + " Backup";
    modObject = _deep.deepMapValues(modObject, function (value, key) {
        if (!UrlHelper.isUrl(value)) {
            return value;
        }
        return encodeURI(baseUrl + "/" + FileNameHelper.safe(gameSaveName) + "/" +
                UrlHelper.fileNameForUrl(value)) + "?dl=1";
    });

    JsonLoader.write(filePath, modObject);
};

module.exports = {
    rewrite: rewrite
};