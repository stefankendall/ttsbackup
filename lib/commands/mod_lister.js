var fs = require('fs');
var _ = require('lodash');

var list = function (ignored, opts) {
    var workshopInfosPath = opts.input_file || "/Users/" + process.env.USER + "/My Games/Tabletop Simulator/Mods/Workshop/WorkshopFileInfos.json";
    console.log("Reading mods installed at %s", workshopInfosPath);
    var info = JSON.parse(fs.readFileSync(workshopInfosPath));
    _.forEach(info, function (object, index) {
        console.log("%s: %s", index, object.Name);
    });
};

module.exports = {
    list: list
};