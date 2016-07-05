var fileNameForUrl = function (url) {
    var cleanedOutputName = url.replace(/[:\/]/g, '');
    var extensionRegex = /^(.*)\.([A-Za-z]{3,4})$/;
    if (extensionRegex.test(cleanedOutputName)) {
        var matches = extensionRegex.exec(cleanedOutputName);
        var prefix = matches[1];
        var extension = matches[2];
        cleanedOutputName = prefix.replace(/\./g, '') + '.' + extension;
    }
    else {
        cleanedOutputName = cleanedOutputName.replace(/\./g, '');
    }
    return cleanedOutputName;
};

module.exports = {
    fileNameForUrl: fileNameForUrl
};