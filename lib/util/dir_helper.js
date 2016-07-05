var mkdirp = require('mkdirp');
var _ = require('lodash');

var outputDir = './archive';

var paths = function (gameName) {
    var archiveDir = outputDir + "/" + gameName;
    var workshopDir = archiveDir + "/Workshop";
    var modelsDir = archiveDir + "/Models";
    var imagesDir = archiveDir + "/Images";
    return {images: imagesDir, models: modelsDir, workshop: workshopDir};
};

var createPaths = function (gameName) {
    var pathLocations = paths(gameName);
    _.forEach([pathLocations.images, pathLocations.models, pathLocations.workshop], function (path) {
        mkdirp(path, {mode: 0777});
    });
};

module.exports = {
    createPaths: createPaths,
    paths: paths,
    outputDir: outputDir
};