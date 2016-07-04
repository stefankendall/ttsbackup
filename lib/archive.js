var fs = require('fs');
var path = require('path');
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

var download = function (toDirectory, url, callback) {
    var cleanedOutputName = url.replace(/[:\/]/g, '');
    var extensionRegex = /(.*\.)(\w\w\w\w*)/;
    if (extensionRegex.test(cleanedOutputName)) {
        var matches = extensionRegex.exec(cleanedOutputName);
        var prefix = matches[1];
        var extension = matches[2];
        cleanedOutputName = prefix.replace(/\./g, '') + '.' + extension;
    }
    console.log("downloading: %s", url);
    request.get(url).pipe(fs.createWriteStream(toDirectory + "/" + cleanedOutputName)).on('close', function () {
        callback(null, url);
    });
};

var archive = function (filePath) {
    var content = fs.readFileSync(filePath);
    var json = JSON.parse(content);
    var gameName = json.SaveName;

    var archiveDir = "./archive/" + gameName;
    var workshopDir = archiveDir + "/Workshop";
    var modelsDir = archiveDir + "/Models";
    var imagesDir = archiveDir + "/Images";
    _.forEach([imagesDir, modelsDir, workshopDir], function (path) {
        mkdirp(path, {mode: 0777});
    });
    fs.writeFileSync(workshopDir + "/" + path.basename(filePath), content);
    var externalResources = getExternalResources(json);

    var isModel = function (url) {
        return /^.*\/[a-zA-Z\d]+$/.test(url);
    };
    var images = _.reject(externalResources, isModel);
    var models = _.filter(externalResources, isModel);
    async.everyLimit(images, 4, _.curry(download)(imagesDir), function () {
        console.log("All images cached");
    });
};

module.exports = {
    archive: archive
};