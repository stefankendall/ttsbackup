var os = require('os');
var path = require('path');

module.exports = class WorkshopHelper {
    static defaultWorkshopInfosPath() {
        var pathObjects = [os.homedir()];
        if (os.platform() === 'win32') {
            pathObjects.push('Documents');
        }
        pathObjects = pathObjects.concat(['My Games', 'Tabletop Simulator', 'Mods', 'Workshop', 'WorkshopFileInfos.json']);
        return path.join.apply(this, pathObjects);
    };
};