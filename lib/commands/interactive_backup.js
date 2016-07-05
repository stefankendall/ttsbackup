var mod_lister = require('./mod_lister');
var prompt = require('prompt');
var fs = require('fs');
var _ = require('lodash');

var run = function () {
    prompt.message = '';
    prompt.get({
        properties: {
            workshopFileInfosPath: {
                description: "WorkshopFileInfos.json path",
                type: 'string',
                required: true,
                default: mod_lister.defaultWorkshopInfosPath(),
                message: "Cannot find file at that path, or file is not proper json",
                conform: function (filePath) {
                    return fs.existsSync(filePath) && _.endsWith(filePath, ".json");
                }
            }
        }
    }, workshopFileInfoFound);
};

var workshopFileInfoFound = function (err, result) {
    var path = result.workshopFileInfosPath;
    console.log("Which mod would you like to backup?");
    var installed_mods = mod_lister.list(null, {input_file: path});

    prompt.get({
        properties: {
            number: {
                message: "Number must be [0 - " + (installed_mods.length - 1) + "]",
                type: 'integer',
                required: true,
                conform: function (number) {
                    return number >= 0 && number < installed_mods.length;
                }
            }
        }
    }, function (err, result) {
        modSelected(installed_mods[result.number])
    });
};

var modSelected = function (mod) {
    var options = {modPath: mod.Directory};
    console.log("Where would you like to save downloaded files?");

    var defaultDownloadPath = "~/Dropbox/public/games";
    prompt.get({
        properties: {
            directory: {
                default: defaultDownloadPath,
                type: 'string',
                required: true,
                conform: function (path) {
                    return path === defaultDownloadPath || fs.existsSync(path);
                },
                message: "Directory does not exist"
            }
        }
    }, function (err, result) {
        options.downloadDirectory = result.directory;
        downloadDirectorySelected(options);
    });
};

var downloadDirectorySelected = function (options) {
    console.log("What url should be used to prefix mod files?");
    console.log("e.g. https://dl.dropboxusercontent.com/u/<userid>/games");
    prompt.get({
        properties: {
            url: {
                required: true,
                type: 'string'
            }
        }
    }, function (err, result) {
        options.rewriteBaseUrl = result.url;
        baseUrlSelected(options);
    });
};

var baseUrlSelected = function (options) {
    console.log(options);
};

module.exports = {
    run: run
};