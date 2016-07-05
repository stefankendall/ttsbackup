var mkdirp = require('mkdirp');
var _ = require('lodash');

var fileSafeName = function (name) {
    return name.replace(/[|&:;$%@"<>()+,]/g, "");
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
        var archiveDir = this.outputDir + "/" + fileSafeName(this.gameName);
        var workshopDir = archiveDir + "/Workshop";
        var modelsDir = archiveDir + "/" + PathHelper.modelsDirName();
        var imagesDir = archiveDir + "/" + PathHelper.imagesDirName();
        return {
            base: archiveDir,
            images: imagesDir,
            models: modelsDir,
            workshop: workshopDir,
            content: fileSafeName(this.gameName) + ".json"
        };
    }
};