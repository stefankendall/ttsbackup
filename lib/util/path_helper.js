var mkdirp = require('mkdirp');
var _ = require('lodash');
var fs = require('fs');
var path = require('path');

module.exports = class PathHelper {
    constructor(outputDir, gameName) {
        this.outputDir = outputDir;
        this.gameName = gameName;
    }

    static fileSafeName(name) {
        return name.replace(/[|&:;$%@"<>()+,!\/]/g, "");
    }

    createPaths() {
        mkdirp.sync(this.paths().base, {mode: 0o777});
    }

    paths() {
        var archiveDir = path.join(this.outputDir, PathHelper.fileSafeName(this.gameName));
        return {
            base: archiveDir,
            content: PathHelper.fileSafeName(this.gameName) + ".json"
        };
    }

    pathsExist() {
        return fs.existsSync(this.paths().base);
    }
};