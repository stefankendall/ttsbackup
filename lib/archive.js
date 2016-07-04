var fs = require('fs');
var _ = require('lodash');
var mkdirp = require('mkdirp');

var archive = function (path) {
    var content = fs.readFileSync(path);
    var json = JSON.parse(content);
    var gameName = json.SaveName;

    var archiveDir = "./archive/" + gameName;
    _.forEach([archiveDir + "/Images", archiveDir + "/Models", archiveDir + "/Workshop"], function(path){
        mkdirp(path, {mode: 0777});
    });
};

module.exports = {
    archive: archive
};