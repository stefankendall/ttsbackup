var fs = require('fs');
var _ = require('lodash');
var WorkshopHelper = require('../util/workshop_helper');

var list = function (options) {
    var workshopInfosPath = _.get(options, 'workshopFileInfosPath') || WorkshopHelper.defaultWorkshopInfosPath();
    var allMods = JSON.parse(fs.readFileSync(workshopInfosPath));
    var modEntries = _.chain(allMods).filter(function (object) {
        return _.endsWith(object.Directory, 'json');
    }).sortBy('Name').value();
    _.forEach(modEntries, function (object, index) {
        console.log("[%s]: %s", index, object.Name);
    });
    return modEntries;
};

module.exports = {
    list: list
};