var fs = require('fs');
var path = require('path');
var glob = require('glob');
var _ = require('lodash');
var _deep = require('lodash-deep');
var request = require('request');
var async = require('async');
var url_helper = require('./url_helper');
var archive_dir_helper = require('./archive_dir_helper');

var getExternalResources = function (object) {
    var urls = [];
    _deep.deepMapValues(object, function (value) {
        if (_.startsWith(value, 'http')) {
            urls.push(value);
        }
    });
    return _.uniq(urls);
};

var download = function (toDirectory, url, callback) {
    console.log("downloading: %s", url);
    request.get(url).pipe(fs.createWriteStream(toDirectory + "/" + url_helper.fileNameForUrl(url))).on('close', function () {
        callback(null, url);
    });
};

var archive = function (filePath, options) {
    var content = fs.readFileSync(filePath);
    var json = JSON.parse(content);
    var gameName = json.SaveName;
    archive_dir_helper.createPaths(gameName);

    var pathLocations = archive_dir_helper.paths(gameName);
    if (options.clean) {
        _.forEach(pathLocations, function (dir) {
            glob(dir + "/*", null, function (err, files) {
                _.each(files, fs.unlinkSync);
            });
        });
    }

    fs.writeFileSync(pathLocations.workshop + "/" + path.basename(filePath), content);
    var externalResources = getExternalResources(json);

    var isModel = function (url) {
        return /^.*\/[a-zA-Z\d]+$/.test(url);
    };
    var images = _.reject(externalResources, isModel);
    var models = _.filter(externalResources, isModel);
    var numberOfParallelDownloads = 4;
    async.everyLimit(images, numberOfParallelDownloads, _.curry(download)(pathLocations.images), function () {
        console.log("All images cached");
        async.everyLimit(models, numberOfParallelDownloads, _.curry(download)(pathLocations.models), function () {
            console.log("All models cached");
        });
    });
};

module.exports = {
    archive: archive
};