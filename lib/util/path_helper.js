var mkdirp = require('mkdirp');
var _ = require('lodash');
var fs = require('fs');
var path = require('path');

var fileSafeName = function (name) {
    return name.replace(/[|&:;$%@"<>()+,!\/]/g, "");
};

module.exports = class PathHelper {
    static modelsDirName() {
        return "Models";
    }

    static imagesDirName() {
        return "Images";
    }

    constructor(outputDir, gameName) {
        this.outputDir = outputDir;
        this.gameName = gameName;
    }

    createPaths() {
        var pathLocations = this.paths();
        _.forEach([pathLocations.images, pathLocations.models, pathLocations.workshop], function (path) {
            mkdirp.sync(path, {mode: 0o777});
        });
    }

    paths() {
        var archiveDir = path.join(this.outputDir, fileSafeName(this.gameName));
        var workshopDir = path.join(archiveDir, "Workshop");
        var modelsDir = path.join(archiveDir, PathHelper.modelsDirName());
        var imagesDir = path.join(archiveDir, PathHelper.imagesDirName());
        return {
            base: archiveDir,
            images: imagesDir,
            models: modelsDir,
            workshop: workshopDir,
            content: fileSafeName(this.gameName) + ".json"
        };
    }

    pathsExist() {
        return fs.existsSync(this.paths().base);
    }
};