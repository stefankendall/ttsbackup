var fs = require('fs');
var path = require('path');
var glob = require('glob');
var _ = require('lodash');
var _deep = require('lodash-deep');
var request = require('request');
var async = require('async');
var url_helper = require('./../util/url_helper');
var dir_helper = require('./../util/dir_helper');
var resource_helper = require('./../util/resource_helper');

var getExternalResources = function (object) {
    var urls = [];
    _deep.deepMapValues(object, function (value) {
        if (_.startsWith(value, 'http')) {
            urls.push(value);
        }
    });
    return _.uniq(urls);
};

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
    dir_helper(outputDir).createPaths(gameName);
    var pathLocations = dir_helper(outputDir).paths(gameName);
    if (options.clean) {
        _.forEach(pathLocations, function (dir) {
            _.each(glob.sync(dir + "/*"), fs.unlinkSync);
        });
    }

    fs.writeFileSync(pathLocations.workshop + "/" + pathLocations.content, modContent);
    var externalResources = getExternalResources(json);

    var images = _.reject(externalResources, resource_helper.isModel);
    var models = _.filter(externalResources, resource_helper.isModel);
    var numberOfParallelDownloads = 4;
    async.everyLimit(images, numberOfParallelDownloads, _.curry(downloadUrl)(pathLocations.images), function () {
        async.everyLimit(models, numberOfParallelDownloads, _.curry(downloadUrl)(pathLocations.models), function () {
            doneCallback(null, pathLocations.workshop + "/" + pathLocations.content);
        });
    });
};

module.exports = {
    download: download
};