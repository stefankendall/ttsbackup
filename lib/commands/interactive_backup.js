var mod_lister = require('./mod_lister');
var prompt = require('prompt');
var fs = require('fs');
var _ = require('lodash');

var run = function () {
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
    }, function (err, result) {
        var path = result.workshopFileInfosPath;
        console.log("Which mod would you like to backup?");
        mod_lister.list(null, {input_file: path});
    });
};

module.exports = {
    run: run
};