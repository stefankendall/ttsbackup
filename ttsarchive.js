var program = require('commander');
var archive = require('./lib/archive');

program.version('0.0.0');

program
    .command('archive [path]')
    .description('run setup commands for all envs')
    .action(function (path, options) {
        archive.archive(path);
    });

program.parse(process.argv);