var url_helper = require('./../util/url_helper');
var fs = require('fs');
var _ = require('lodash');
var _deep = require('lodash-deep');
var dir_helper = require('./../util/dir_helper');

var rewrite = function (filePath, options) {
    if (_.isUndefined(filePath)) {
        console.error("Must supply a .json file to rewrite");
        process.exit("1");
    }

    if (_.isUndefined(options.base_url)) {
        console.error('must supply a base url to replace in the json file');
        process.exit("1");
    }

    console.log("rewriting %s with base url: %s", filePath, options.base_url);
    var base_url = options.base_url;
    var content = fs.readFileSync(filePath);
    var object = JSON.parse(content);
    var gameName = object.SaveName;
    var pathLocations = dir_helper.paths(gameName);
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
            return encodeURI(base_url + existingLocation.substring(dir_helper.outputDir.length) + "/" + locallyMappedFileName);
        }
        return value;
    });

    mappedModFile.SaveName = gameName + " Backup";
    var backupLocation = dir_helper.outputDir + "/" + gameName + ".json";
    fs.writeFileSync(backupLocation, JSON.stringify(mappedModFile));
    console.log("Rewritten mod files written to %s", backupLocation);
};

module.exports = {
    rewrite: rewrite
};