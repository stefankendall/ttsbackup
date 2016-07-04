var fs = require('fs');
var path = require('path');
var glob = require('glob');
var _ = require('lodash');
var _deep = require('lodash-deep');
var mkdirp = require('mkdirp');
var request = require('request');
var async = require('async');

var getExternalResources = function (object) {
    var urls = [];
    _deep.deepMapValues(object, function (value) {
        if (_.startsWith(value, 'http')) {
            urls.push(value);
        }
    });
    return _.uniq(urls);
};

var replacementFileName = function (url) {
    var cleanedOutputName = url.replace(/[:\/]/g, '');
    var extensionRegex = /^(.*)\.([A-Za-z]{3,4})$/;
    if (extensionRegex.test(cleanedOutputName)) {
        var matches = extensionRegex.exec(cleanedOutputName);
        var prefix = matches[1];
        var extension = matches[2];
        cleanedOutputName = prefix.replace(/\./g, '') + '.' + extension;
    }
    else {
        cleanedOutputName = cleanedOutputName.replace(/\./g, '');
    }
    return cleanedOutputName;
};

var download = function (toDirectory, url, callback) {
    console.log("downloading: %s", url);
    request.get(url).pipe(fs.createWriteStream(toDirectory + "/" + replacementFileName(url))).on('close', function () {
        callback(null, url);
    });
};

var archive = function (filePath, options) {
    var content = fs.readFileSync(filePath);
    var json = JSON.parse(content);
    var gameName = json.SaveName;

    var archiveDir = "./archive/" + gameName;
    var workshopDir = archiveDir + "/Workshop";
    var modelsDir = archiveDir + "/Models";
    var imagesDir = archiveDir + "/Images";
    var outputDirectories = [imagesDir, modelsDir, workshopDir];
    _.forEach(outputDirectories, function (path) {
        mkdirp(path, {mode: 0777});
    });

    if (options.clean) {
        _.forEach(outputDirectories, function (dir) {
            glob(dir + "/*", null, function (err, files) {
                _.each(files, fs.unlinkSync);
            });
        });
    }

    fs.writeFileSync(workshopDir + "/" + path.basename(filePath), content);
    var externalResources = getExternalResources(json);

    var isModel = function (url) {
        return /^.*\/[a-zA-Z\d]+$/.test(url);
    };
    var images = _.reject(externalResources, isModel);
    var models = _.filter(externalResources, isModel);
    var numberOfParallelDownloads = 4;
    async.everyLimit(images, numberOfParallelDownloads, _.curry(download)(imagesDir), function () {
        console.log("All images cached");
        async.everyLimit(models, numberOfParallelDownloads, _.curry(download)(modelsDir), function () {
            console.log("All models cached");
        });
    });
};

module.exports = {
    archive: archive
};