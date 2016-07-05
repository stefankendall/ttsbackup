var fs = require('fs');
var _ = require('lodash');

var defaultWorkshopInfosPath = function () {
    return "/Users/" + process.env.USER + "/My Games/Tabletop Simulator/Mods/Workshop/WorkshopFileInfos.json";
};

var list = function (ignored, opts) {
    var workshopInfosPath = opts.input_file || defaultWorkshopInfosPath();
    var info = JSON.parse(fs.readFileSync(workshopInfosPath));
    _.forEach(info, function (object, index) {
        console.log("[%s]: %s", index, object.Name);
    });
};

module.exports = {
    list: list,
    defaultWorkshopInfosPath: defaultWorkshopInfosPath
};