var os = require('os');
var path = require('path');

var defaultWorkshopInfosPath = function () {
    return path.join(os.homedir(), 'My Games', 'Tabletop Simulator', 'Mods', 'Workshop', 'WorkshopFileInfos.json');
};

module.exports = {
    defaultWorkshopInfosPath: defaultWorkshopInfosPath
};