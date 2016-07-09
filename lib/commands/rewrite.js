var fs = require('fs');
var _ = require('lodash');
var _deep = require('lodash-deep');
var UrlHelper = require('./../util/url_helper');
var FileNameHelper = require('./../util/file_name_helper');
var resource_helper = require('./../util/resource_helper');

var rewrite = function (filePath, options) {
    var baseUrl = options.rewriteBaseUrl;
    if (!baseUrl) {
        console.error("rewriteBaseUrl is required to rewrite a mod file");
        process.exit(1);
    }

    console.log("rewriting %s with base url: %s", filePath, baseUrl);
    var modContent = fs.readFileSync(filePath);
    var modObject = JSON.parse(modContent);
    var mappedModFile = _deep.deepMapValues(modObject, function (value, key) {
        if (!UrlHelper.isUrl(value)) {
            return value;
        }

        var locallyMappedFileName = UrlHelper.fileNameForUrl(value);
        var keysThatRequireSpecialFileDownloads = ['MeshURL', 'ColliderURL'];
        var isRaw = _.some(keysThatRequireSpecialFileDownloads, _.curry(_.endsWith, 2)(key));
        var suffix = isRaw ? "?dl=1" : "";
        return encodeURI(baseUrl + "/" + FileNameHelper.safe(modObject.SaveName) + "/" + locallyMappedFileName) + suffix;
    });

    var backupSuffix = "Backup";
    mappedModFile.SaveName = _.endsWith(modObject.SaveName, backupSuffix) ?
        modObject.SaveName : modObject.SaveName + " " + backupSuffix;
    fs.writeFileSync(filePath, JSON.stringify(mappedModFile, null, 4));
};

module.exports = {
    rewrite: rewrite
};