var mod_lister = require('./mod_lister');
var path = require('path');
var os = require('os');
var prompt = require('prompt');
var fs = require('fs');
var _ = require('lodash');
var download = require('./download');
var rewrite = require('./rewrite');
var workshop_helper = require('../util/workshop_helper');
var mod_installer = require('./mod_installer');
var mod_validator = require('./mod_validator');
const untildify = require('untildify');

var run = function () {
    var options = readPreferences();
    console.log("To find out which mods you have installed, we need to read WorkshopFileInfos.json in your TabletopSimulator mods directory");
    prompt.message = '';
    prompt.get({
        properties: {
            workshopFileInfosPath: {
                description: "WorkshopFileInfos.json path",
                type: 'string',
                required: true,
                default: options.workshopFileInfosPath || workshop_helper.defaultWorkshopInfosPath(),
                message: "Cannot find file at that path, or file is not proper json",
                conform: function (filePath) {
                    return fs.existsSync(untildify(filePath)) && _.endsWith(filePath, ".json");
                }
            }
        }
    }, function (err, result) {
        options.workshopFileInfosPath = untildify(result.workshopFileInfosPath);
        workshopFileInfoFound(options);
    });
};

var workshopFileInfoFound = function (options) {
    console.log("\nWhich mod would you like to backup?");
    const installed_mods = mod_lister.list(options);

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
    console.log("\nWhere would you like to save downloaded files?");
    var defaultDownloadPath = path.join(os.homedir(), "Dropbox", "public", "games");
    prompt.get({
        properties: {
            directory: {
                default: options.downloadDirectory || defaultDownloadPath,
                type: 'string',
                required: true,
                conform: function (path) {
                    return fs.existsSync(untildify(path));
                },
                before: function (value) {
                    return untildify(value);
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
    console.log("\nWhat url should be used to prefix mod files?");
    console.log("e.g. https://dl.dropboxusercontent.com/u/<userid>/games");
    prompt.get({
        properties: {
            url: {
                default: options.rewriteBaseUrl,
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
    download.download(options.modPath, {outputDir: options.downloadDirectory}, function (err, rewriteModPath) {
        console.log("All files downloaded. Mod file copied to: %s", rewriteModPath);
        options.rewriteModPath = rewriteModPath;
        rewrite.rewrite(rewriteModPath, options);
        mod_installer.install(options.rewriteModPath, options);

        console.log("Installed! Mod will appear as \"%s\"", options.mod.Name + " Backup");
        console.log("\nWhen all should be available on the public internet (i.e. synced via dropbox), run this command:");
        console.log("ttsbackup validate \"%s\"", options.rewriteModPath);
        writePreferences(options);
    });
};

var preferencesPath = untildify("~/.ttsbackup");
var writePreferences = function (options) {
    const preferencesToSave = _.pick(options, ['workshopFileInfosPath', 'rewriteBaseUrl', 'downloadDirectory']);
    fs.writeFileSync(preferencesPath, JSON.stringify(preferencesToSave, null, 4));
};

var readPreferences = function () {
    if (!fs.existsSync(preferencesPath)) {
        return {};
    }
    return JSON.parse(fs.readFileSync(preferencesPath));
};

module.exports = {
    run: run
};