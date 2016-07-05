var url_helper = require('./../util/url_helper');
var fs = require('fs');
var _ = require('lodash');
var _deep = require('lodash-deep');
var dir_helper = require('./../util/dir_helper');

var rewrite = function (filePath, options) {
    var baseUrl = options.rewriteBaseUrl;
    var downloadDirectory = options.downloadDirectory;
    console.log("rewriting %s with base url: %s", filePath, baseUrl);
    var content = fs.readFileSync(filePath);
    var object = JSON.parse(content);
    var gameName = object.SaveName;
    var pathLocations = dir_helper(downloadDirectory).paths(gameName);
    var fileLocations = [pathLocations.images, pathLocations.models];

    var mappedModFile = _deep.deepMapValues(object, function (value) {
        if (_.startsWith(value, 'http')) {
            var locallyMappedFileName = url_helper.fileNameForUrl(value);
            var existingLocation = _.find(fileLocations, function (location) {
                return fs.existsSync(location + "/" + locallyMappedFileName);
            });
            if (!existingLocation) {
                console.error("Could not find locally cached file for resource: " + value);
                process.exit(1);
            }
            return encodeURI(baseUrl + existingLocation.substring(downloadDirectory.length) + "/" + locallyMappedFileName);
        }
        return value;
    });

    mappedModFile.SaveName = gameName + " Backup";
    var backupLocation = pathLocations.base + "/" + pathLocations.content;
    fs.writeFileSync(backupLocation, JSON.stringify(mappedModFile));
    console.log("Rewritten mod files written to %s", backupLocation);
};

module.exports = {
    rewrite: rewrite
};