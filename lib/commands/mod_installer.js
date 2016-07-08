var fs = require('fs');
var _ = require('lodash');
var workshop_helper = require('../util/workshop_helper');
var path = require('path');

var install = function (modPath, opts) {
    var workshopInfosPath = opts.workshopFileInfosPath || workshop_helper.defaultWorkshopInfosPath();
    var outputPath = path.join(path.dirname(workshopInfosPath), path.basename(modPath));
    console.log("Copying (installing) %s to %s", modPath, outputPath);
    fs.writeFileSync(outputPath, fs.readFileSync(modPath));
};

module.exports = {
    install: install
};