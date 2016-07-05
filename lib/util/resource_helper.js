var isModel = function (url) {
    return /^.*\/[a-zA-Z\d]+$/.test(url);
};

module.exports = {
    isModel: isModel
};