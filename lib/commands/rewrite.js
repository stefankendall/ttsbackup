var url_helper = require('./../util/url_helper');
var fs = require('fs');
var _ = require('lodash');
var _deep = require('lodash-deep');
var PathHelper = require('./../util/path_helper');
var resource_helper = require('./../util/resource_helper');

var rewrite = function (filePath, options, callback) {
    var baseUrl = options.rewriteBaseUrl;
    if (!baseUrl) {
        console.error("rewriteBaseUrl is required to rewrite a mod file");
        process.exit(1);
    }
    callback = callback || _.identity;

    console.log("rewriting %s with base url: %s", filePath, baseUrl);
    var modContent = fs.readFileSync(filePath);
    var object = JSON.parse(modContent);
    var path_helper = new PathHelper("", object.SaveName);
    var mappedModFile = _deep.deepMapValues(object, function (value, key) {
        if (url_helper.isUrl(value)) {
            var locallyMappedFileName = url_helper.fileNameForUrl(value);
            var directory = resource_helper.isModel(value) ? PathHelper.modelsDirName() : PathHelper.imagesDirName();
            var rawKeys = ['MeshURL', 'ColliderURL'];
            var isRaw = _.some(rawKeys, function (rawKey) {
                return _.endsWith(key, rawKey);
            });
            var suffix = isRaw ? "?dl=1" : "";
            return encodeURI(baseUrl + path_helper.paths().base + "/" + directory + "/" + locallyMappedFileName) + suffix;
        }
        return value;
    });

    mappedModFile.SaveName = object.SaveName + " Backup";
    fs.writeFileSync(filePath, JSON.stringify(mappedModFile, null, 4));
    console.log("Mod rewrite finished");
    callback(null, filePath);
};

module.exports = {
    rewrite: rewrite
};