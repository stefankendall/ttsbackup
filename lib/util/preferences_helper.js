const untildify = require('untildify');
const fs = require('fs');
const _ = require('lodash');

module.exports = class PreferencesHelper {
    static preferencesPath() {
        return untildify("~/.ttsbackup");
    }

    static read() {
        if (!fs.existsSync(PreferencesHelper.preferencesPath())) {
            return {};
        }
        return JSON.parse(fs.readFileSync(PreferencesHelper.preferencesPath()));
    }

    static write(options) {
        const preferencesToSave = _.pick(options, ['workshopFileInfosPath', 'rewriteBaseUrl', 'downloadDirectory']);
        fs.writeFileSync(PreferencesHelper.preferencesPath(), JSON.stringify(preferencesToSave, null, 4));
    }
};