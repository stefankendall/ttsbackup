const brokenSuffix = ";;BROKEN";

module.exports = class JsonFixer {
    static fixJson(jsonString) {
        var brokenPattern = /": Infinity/g;
        return jsonString.replace(brokenPattern, "\": \"Infinity" + brokenSuffix + "\"");
    };

    static breakJson(jsonString) {
        var correctedPattern = new RegExp("\": \"Infinity" + brokenSuffix + "\"", 'g');
        return jsonString.replace(correctedPattern, "\": Infinity");
    };
};