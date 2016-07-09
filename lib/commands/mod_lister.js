var fs = require('fs');
var _ = require('lodash');
var workshop_helper = require('../util/workshop_helper');

var list = function (options) {
    var workshopInfosPath = _.get(options, 'workshopFileInfosPath') || workshop_helper.defaultWorkshopInfosPath();
    var modEntries = _.filter(JSON.parse(fs.readFileSync(workshopInfosPath)), function (object) {
        return _.endsWith(object.Directory, 'json');
    });
    _.forEach(modEntries, function (object, index) {
        console.log("[%s]: %s", index, object.Name);
    });
    return modEntries;
};

module.exports = {
    list: list
};