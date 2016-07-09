var isModel = function (url) {
    var noFileExtension = /^.*\/[a-zA-Z\d]+$/;
    return noFileExtension.test(url);
};

module.exports = {
    isModel: isModel
};