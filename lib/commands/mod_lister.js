var fs = require('fs');
var _ = require('lodash');

var defaultWorkshopInfosPath = function () {
    return "/Users/" + process.env.USER + "/My Games/Tabletop Simulator/Mods/Workshop/WorkshopFileInfos.json";
};

var list = function (ignored, opts) {
    var workshopInfosPath = opts.workshopFileInfosPath || defaultWorkshopInfosPath();
    var info = _.filter(JSON.parse(fs.readFileSync(workshopInfosPath)), function (object) {
        return _.endsWith(object.Directory, 'json');
    });
    _.forEach(info, function (object, index) {
        console.log("[%s]: %s", index, object.Name);
    });
    return info;
};

module.exports = {
    list: list,
    defaultWorkshopInfosPath: defaultWorkshopInfosPath
};