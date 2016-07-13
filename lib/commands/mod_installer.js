var fs = require('fs');
var _ = require('lodash');
var path = require('path');
var WorkshopHelper = require('../util/workshop_helper');

var install = function (modPath, opts) {
    var workshopInfosPath = opts.workshopFileInfosPath || WorkshopHelper.defaultWorkshopInfosPath();
    var outputPath = path.join(path.dirname(workshopInfosPath), path.basename(modPath));
    console.log("Copying (installing) %s to %s", modPath, outputPath);
    fs.writeFileSync(outputPath, fs.readFileSync(modPath));
};

module.exports = {
    install: install
};