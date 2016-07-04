var program = require('commander');
var archive = require('./lib/archive');

program.version('0.0.0');

program
    .command('archive [path]')
    .description('run setup commands for all envs')
    .option("-b, --base_url [base_url]", "Base url to replace on all assets")
    .action(function (path, options) {
        console.log(path);
        archive.archive(path);
    });

program.parse(process.argv);