var mkdirp = require('mkdirp');
var _ = require('lodash');

var fileSafeName = function (name) {
    return name.replace(/[|&:;$%@"<>()+,]/g, "");
};

var paths = function (gameName) {
    var archiveDir = this.outputDir + "/" + fileSafeName(gameName);
    var workshopDir = archiveDir + "/Workshop";
    var modelsDir = archiveDir + "/Models";
    var imagesDir = archiveDir + "/Images";
    return {
        images: imagesDir,
        models: modelsDir,
        workshop: workshopDir,
        base: archiveDir,
        content: fileSafeName(gameName) + ".json"
    };
};

var createPaths = function (gameName) {
    var pathLocations = paths(fileSafeName(gameName));
    _.forEach([pathLocations.images, pathLocations.models, pathLocations.workshop], function (path) {
        mkdirp.sync(path, {mode: 0777});
    });
};

module.exports = function (outputDir) {
    this.outputDir = outputDir;
    this.createPaths = createPaths;
    this.paths = paths;
    return this;
};