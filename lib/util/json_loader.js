var fs = require('fs');
var JsonFixer = require('./json_fixer');

module.exports = class JsonLoader {
    static read(path) {
        return JSON.parse(JsonFixer.fixJson(fs.readFileSync(path, "utf8")));
    }

    static write(path, jsonObject) {
        fs.writeFileSync(path, JsonFixer.breakJson(JSON.stringify(jsonObject, null, 4)));
    }
};