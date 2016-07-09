var mkdirp = require('mkdirp');
var fs = require('fs');
var path = require('path');
var FileNameHelper = require('./file_name_helper');
var _ = require('lodash');
var glob = require('glob');

module.exports = class PathHelper {
    constructor(outputDir, gameName) {
        this.outputDir = outputDir;
        this.gameName = gameName;
    }

    createPaths() {
        mkdirp.sync(this.paths().base, {mode: 0o777});
    }

    empty() {
        _.each(glob.sync(path.join(this.archivePath(), "*"), fs.unlinkSync));
    }

    modPath() {
        return path.join(this.archivePath(), this.modFileName());
    }

    modFileName() {
        return FileNameHelper.safe(this.gameName) + ".json";
    }

    archivePath() {
        return path.join(this.outputDir, FileNameHelper.safe(this.gameName));
    }

    paths() {
        return {
            base: this.archivePath(),
            content: this.modFileName()
        };
    }

    pathsExist() {
        return fs.existsSync(this.archivePath());
    }
};