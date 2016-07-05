var program = require('commander');
var download = require('./lib/commands/download');
var rewriter = require('./lib/commands/rewrite');
var mod_lister = require('./lib/commands/mod_lister');
var interactive_backup = require('./lib/commands/interactive_backup');

program.version('0.0.0');

program
    .command('backup')
    .description('interactively pick mods to backup to a particular location, create a mod file for tabletop simulator, and add to your installed mods. If you\'re unsure, this is the option you\'re looking for.')
    .action(interactive_backup.run);

program
    .command('download <path>')
    .option('-c, --clean', 'removes all downloaded game files from archive/Game/Images, Models, and Workshop before starting the archive process')
    .description('download all images, models, and the mod file needed to load in tts')
    .action(download.download);

program.command('rewrite <path>')
    .description('rewrite urls in the provided mod json file')
    .option('-b, --base_url <path>', 'the base url for all assets, e.g. https://dl.dropboxusercontent.com/u/5142994/games/MyGame')
    .action(rewriter.rewrite);

program.command('list [options]')
    .description('list installed mods')
    .option('-i, --input_file <path>', "The WorkshopFileInfos.json path. On OSX, this defaults to /Users/<user>/My Games/Tabletop Simulator/Mods/Workshop/WorkshopFileInfos.json")
    .action(mod_lister.list);

program.parse(process.argv);

if (process.argv.length <= 2) {
    program.help();
}