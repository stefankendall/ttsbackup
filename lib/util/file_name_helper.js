module.exports = class FileNameHelper {
    static safe(name) {
        return name.replace(/[|&:;$%@"<>()+,!\/]/g, "");
    }
};