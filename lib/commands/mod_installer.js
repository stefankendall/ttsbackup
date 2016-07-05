var fs = require('fs');
var _ = require('lodash');
var workshop_helper = require('../util/workshop_helper');
var path = require('path');

var install = function (modPath, opts, callback) {
    callback = callback || _.identity;
    var workshopInfosPath = opts.workshopFileInfosPath || workshop_helper.defaultWorkshopInfosPath();
    var outputPath = path.dirname(workshopInfosPath) + "/" + path.basename(modPath);
    console.log("Copying (installing) %s to %s", modPath, outputPath);
    var writable = fs.createWriteStream(outputPath);
    writable.on('finish', callback);
    fs.createReadStream(modPath).pipe(writable);
};

module.exports = {
    install: install
};