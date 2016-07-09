var fs = require('fs');
var _ = require('lodash');
var UrlHelper = require('../util/url_helper');
var async = require('async');
var request = require('request');

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

var validate = function (path, options, callback) {
    callback = callback || _.identity;
    if (!fs.existsSync(path)) {
        console.error("Mod file at path: %s does not exist", path);
        process.exit(1);
    }

    var fileContents = fs.readFileSync(path);
    var content;
    try {
        content = JSON.parse(fileContents);
    }
    catch (e) {
        console.error("mod file is corrupt");
        process.exit(1);
    }

    var urls = UrlHelper.getUniqueUrlsInObject(content);
    async.mapLimit(urls, 4, validateUrl, function (err, results) {
        var counts = _.countBy(results, _.identity);
        console.log("CHECKED: %d", results.length);
        console.log("PASSED: %d", counts.true || 0);
        console.log("FAILED: %d", counts.false || 0);
        if (counts.false > 0 && counts.false < results.length) {
            console.log("Errors may or may not be related to the backup process. Check your mod in game to see if anything is missing.");
        }
        callback();
    });
};

module.exports = {
    validate: validate
};