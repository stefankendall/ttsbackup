module.exports = class Timer {
    start() {
        this.startTime = process.hrtime();
    }

    stop() {
        var duration = process.hrtime(this.startTime);
        return (duration[0] + duration[1] / 1e9).toFixed(2);
    }
};