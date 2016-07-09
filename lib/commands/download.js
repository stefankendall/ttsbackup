var fs = require('fs');
var path = require('path');
var glob = require('glob');
var _ = require('lodash');
var request = require('request');
var async = require('async');
var url_helper = require('./../util/url_helper');
var PathHelper = require('./../util/path_helper');
var resource_helper = require('./../util/resource_helper');
var prompt = require('prompt');

var downloadUrl = function (toDirectory, url, callback) {
    console.log("downloading: %s", url);
    request.get(url).pipe(fs.createWriteStream(path.join(toDirectory, url_helper.fileNameForUrl(url))))
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
    var startDownload = function () {
        path_helper.createPaths();
        if (options.clean) {
            path_helper.empty();
        }
        fs.writeFileSync(path_helper.modPath(), modContent);
        var externalResources = url_helper.getUniqueUrlsInObject(json);

        var numberOfConcurrentDownloads = options.numberOfConcurrentDownloads || 4;
        async.everyLimit(externalResources, numberOfConcurrentDownloads, _.curry(downloadUrl)(path_helper.archivePath()), function () {
            doneCallback(null, path_helper.modPath());
        });
    };
    if (path_helper.pathsExist()) {
        console.log("Output path: %s already exists. Overwrite? (true, false)", path_helper.archivePath());
        prompt.get({
            properties: {
                overwrite: {
                    required: true,
                    type: 'boolean',
                    default: 'false',
                    message: 'Use "true", "false", "t", or "f'
                }
            }
        }, function (err, result) {
            if (result.overwrite) {
                startDownload();
            }
            else {
                console.error("Aborting");
                process.exit(1);
            }
        });
    }
    else {
        startDownload();
    }

};

module.exports = {
    download: download
};