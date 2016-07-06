var fs = require('fs');
var path = require('path');
var glob = require('glob');
var _ = require('lodash');
var request = require('request');
var async = require('async');
var url_helper = require('./../util/url_helper');
var PathHelper = require('./../util/path_helper');
var resource_helper = require('./../util/resource_helper');

var downloadUrl = function (toDirectory, url, callback) {
    console.log("downloading: %s", url);
    request.get(url).pipe(fs.createWriteStream(toDirectory + "/" + url_helper.fileNameForUrl(url)))
        .on('error', function () {
            console.error("Error! Could not get resource: %s. Continuing, but check your mod after archiving for issues.", url);
        })
        .on('close', function () {
            callback(null, url);
        });
};

var download = function (filePath, options, doneCallback) {
    doneCallback = doneCallback || _.identity();
    var modContent = fs.readFileSync(filePath);
    var json = JSON.parse(modContent);
    var gameName = json.SaveName;
    var outputDir = options.outputDir || "./archive";
    var path_helper = new PathHelper(outputDir, gameName);
    path_helper.createPaths();
    var pathLocations = path_helper.paths();
    if (options.clean) {
        _.forEach([pathLocations.images, pathLocations.models, pathLocations.workshop], function (dir) {
            _.each(glob.sync(dir + "/*"), fs.unlinkSync);
        });
    }

    var copiedModFilePath = pathLocations.workshop + "/" + pathLocations.content;
    fs.writeFileSync(copiedModFilePath, modContent);
    var externalResources = url_helper.getUniqueUrlsInObject(json);

    var images = _.reject(externalResources, resource_helper.isModel);
    var models = _.filter(externalResources, resource_helper.isModel);
    var numberOfConcurrentDownloads = options.numberOfConcurrentDownloads || 4;
    async.everyLimit(images, numberOfConcurrentDownloads, _.curry(downloadUrl)(pathLocations.images), function () {
        async.everyLimit(models, numberOfConcurrentDownloads, _.curry(downloadUrl)(pathLocations.models), function () {
            doneCallback(null, copiedModFilePath);
        });
    });
};

module.exports = {
    download: download
};