var url_helper = require('./../util/url_helper');
var fs = require('fs');
var _ = require('lodash');
var _deep = require('lodash-deep');
var dir_helper = require('./../util/dir_helper');
var resource_helper = require('./../util/resource_helper');

var rewrite = function (filePath, options) {
    var baseUrl = options.rewriteBaseUrl;

    if (!baseUrl) {
        console.error("rewriteBaseUrl is required to rewrite a mod file");
        process.exist(1);
    }

    console.log("rewriting %s with base url: %s", filePath, baseUrl);
    var content = fs.readFileSync(filePath);
    var object = JSON.parse(content);
    var gameName = object.SaveName;

    var mappedModFile = _deep.deepMapValues(object, function (value) {
        if (_.startsWith(value, 'http')) {
            var locallyMappedFileName = url_helper.fileNameForUrl(value);
            var directory = resource_helper.isModel(value) ? dir_helper('').modelsDirName : dir_helper('').imagesDirName;
            return encodeURI(baseUrl + "/" + directory + "/" + locallyMappedFileName);
        }
        return value;
    });

    mappedModFile.SaveName = gameName + " Backup";
    fs.writeFileSync(filePath, JSON.stringify(mappedModFile));
    console.log("Rewritten mod files written to %s", filePath);
};

module.exports = {
    rewrite: rewrite
};