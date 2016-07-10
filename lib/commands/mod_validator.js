var fs = require('fs');
var _ = require('lodash');
var async = require('async');
var request = require('request');
var UrlHelper = require('../util/url_helper');
var JsonLoader = require('../util/json_loader');
var Timer = require('../util/timer');

var validateUrl = function (url, callback) {
    request.head(url, function (error, response) {
        if (!error && response.statusCode === 200) {
            console.log("[OK] %s", url);
            callback(null, true);
        }
        else {
            console.log("[FAIL] %s", url);
            callback(null, false);
        }
    });
};

var validate = function (modPath, options, doneCallback) {
    if (!fs.existsSync(modPath)) {
        console.error("Mod file at path: %s does not exist", modPath);
        process.exit(1);
    }

    var content;
    try {
        content = JsonLoader.read(modPath);
    }
    catch (e) {
        console.error("mod file is corrupt");
        process.exit(1);
    }

    const timer = new Timer();
    timer.start();
    async.mapLimit(UrlHelper.getUniqueUrlsInObject(content), 16, validateUrl, function (err, results) {
        console.log('Validation Time: %ss', timer.stop());
        var counts = _.countBy(results, _.identity);
        console.log("CHECKED: %d", results.length);
        console.log("PASSED: %d", counts.true || 0);
        console.log("FAILED: %d", counts.false || 0);
        if (counts.false > 0 && counts.false < results.length) {
            console.log("Errors may or may not be related to the backup process. Check your mod in game to see if anything is missing.");
        }
        doneCallback();
    });
};

module.exports = {
    validate: validate
};