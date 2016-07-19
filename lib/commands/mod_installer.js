var fs = require('fs');
var _ = require('lodash');
var path = require('path');
var prompt = require('prompt');
var WorkshopHelper = require('../util/workshop_helper');
var JsonLoader = require('../util/json_loader');

var install = function (modPath, options, callback) {
    var workshopInfosPath = options.workshopFileInfosPath || WorkshopHelper.defaultWorkshopInfosPath();
    var outputPath = path.join(path.dirname(workshopInfosPath), path.basename(modPath));

    var modObject = JsonLoader.read(modPath);
    prompt.get({
        properties: {
            name: {
                description: "What would you like to name the backed up mod?",
                type: 'string',
                required: true,
                default: modObject.SaveName + " Backup",
                conform: function (name) {
                    return !_.isEmpty(_.trim(name));
                }
            }
        }
    }, function (err, result) {
        modObject.SaveName = result.name;
        JsonLoader.write(outputPath, modObject);
        console.log("Mod installed! It will appear in Tabletop Simulator as %s", modObject.SaveName);
        callback();
    });
};

module.exports = {
    install: install
};