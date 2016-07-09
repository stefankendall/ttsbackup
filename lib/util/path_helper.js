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

    modPath() {
        return path.join(this.archivePath(), this.modFileName());
    }

    modFileName() {
        return FileNameHelper.safe(this.gameName) + ".json";
    }

    archivePath() {
        return path.join(this.outputDir, FileNameHelper.safe(this.gameName));
    }

    createArchivePath() {
        mkdirp.sync(this.archivePath(), {mode: 0o777});
    }

    emptyArchivePath() {
        _.each(glob.sync(path.join(this.archivePath(), "*")), fs.unlinkSync);
    }

    archivePathExists() {
        return fs.existsSync(this.archivePath());
    }
};