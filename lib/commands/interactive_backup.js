var mod_lister = require('./mod_lister');
var prompt = require('prompt');
var fs = require('fs');
var _ = require('lodash');
var download = require('./download');
var rewrite = require('./rewrite');
var workshop_helper = require('../util/workshop_helper');
var mod_installer = require('./mod_installer');

var run = function () {
    console.log("To find out which mods you have installed, we need to read WorkshopFileInfos.json in your TabletopSimulator mods directory");
    prompt.message = '';
    prompt.get({
        properties: {
            workshopFileInfosPath: {
                description: "WorkshopFileInfos.json path",
                type: 'string',
                required: true,
                default: workshop_helper.defaultWorkshopInfosPath(),
                message: "Cannot find file at that path, or file is not proper json",
                conform: function (filePath) {
                    return fs.existsSync(filePath) && _.endsWith(filePath, ".json");
                }
            }
        }
    }, workshopFileInfoFound);
};

var workshopFileInfoFound = function (err, result) {
    var options = {workshopFileInfosPath: result.workshopFileInfosPath};
    console.log("Which mod would you like to backup?");
    var installed_mods = mod_lister.list(null, options);

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
        options.modPath = installed_mods[result.number].Directory;
        options.mod = installed_mods[result.number];
        modSelected(options);
    });
};

var modSelected = function (options) {
    console.log("Where would you like to save downloaded files?");
    var defaultDownloadPath = "/Users/" + process.env.USER + "/Dropbox/public/games";
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
    download.download(options.modPath, {outputDir: options.downloadDirectory}, function (err, modPath) {
        console.log("All files downloaded. Mod file copied to: %s", modPath);
        rewrite.rewrite(modPath, options, function () {
            rewriteFinished(options);
        });
    });
};

var rewriteFinished = function (options) {
    mod_installer.install(options.modPath, options, function () {
        console.log("Installed! Mod will appear as \"%s\"", options.mod.Name + " Backup");
    });
};

module.exports = {
    run: run
};