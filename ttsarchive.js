var program = require('commander');
var archive = require('./lib/archive');
var rewriter = require('./lib/rewrite');
var _ = require('lodash');

program.version('0.0.0');

program
    .command('archive [path]')
    .option('-c, --clean', 'removes all downloaded game files before downloading files')
    .description('download all images, models, and the mod file needed to load in tts')
    .action(function (path, options) {
        archive.archive(path, options);
    });

program.command('rewrite [path]')
    .description('rewrite urls in the provided json file')
    .option('-b, --base_url <path>', 'the base url for all assets, e.g. https://dl.dropboxusercontent.com/u/5142994/games/MyGame')
    .action(function (path, options) {
        if (_.isUndefined(path)) {
            console.error("Must supply a .json file to overwrite");
            process.exit("1");
        }

        if (_.isUndefined(options.base_url)) {
            console.error('must supply a base url to replace in the json file');
            process.exit("1");
        }

        rewriter.rewrite(path, options);
    });

program.parse(process.argv);