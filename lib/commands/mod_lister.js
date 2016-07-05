var fs = require('fs');
var _ = require('lodash');
var workshop_helper = require('../util/workshop_helper');

var list = function (ignored, opts) {
    var workshopInfosPath = opts.workshopFileInfosPath || workshop_helper.defaultWorkshopInfosPath();
    var info = _.filter(JSON.parse(fs.readFileSync(workshopInfosPath)), function (object) {
        return _.endsWith(object.Directory, 'json');
    });
    _.forEach(info, function (object, index) {
        console.log("[%s]: %s", index, object.Name);
    });
    return info;
};

module.exports = {
    list: list
};