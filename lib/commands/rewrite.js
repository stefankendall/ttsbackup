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
    var mappedModFile = _deep.deepMapValues(modObject, function (value, key) {
        if (!UrlHelper.isUrl(value)) {
            return value;
        }

        var locallyMappedFileName = UrlHelper.fileNameForUrl(value);
        var suffix = "?dl=1";
        return encodeURI(baseUrl + "/" + FileNameHelper.safe(modObject.SaveName) + "/" + locallyMappedFileName) + suffix;
    });

    var backupSuffix = "Backup";
    mappedModFile.SaveName = _.endsWith(modObject.SaveName, backupSuffix) ?
        modObject.SaveName : modObject.SaveName + " " + backupSuffix;
    JsonLoader.write(filePath, mappedModFile);
};

module.exports = {
    rewrite: rewrite
};