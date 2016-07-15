# Tabletop Simulator Backup

This tool backs up Tabletop Simulator Mods by downloading and storing the mod file and all associated assets locally. Then, it lets you change all the URLs in the mod file to point to your copied files, hosted on dropbox or wherever else. Why would you want to do this? A few reasons.
 
 1. Lots of mods have images and assets hosted on limited or unreliable servers. Many games load images directly from imgur, pastebin, or someone's private dropbox. If any of those go down (like a popular mod hitting the dropbox cap), you can't play the mod.
 1. Mod authors can intentionally remove mods or delete assets. If they do that, it's gone.
 1. Hosting files yourself could make mod loading and sharing a lot faster depending on what host the mod author is using.

## Installation

    npm install -g ttsbackup
    
## Backup mods still on the workshop

After installation, run `ttsbackup`. Follow the on-screen prompts. Open up Tabletop Simulator, and your mod will appear as `<Original Mod Name> Backup`.

### Example

    To find out which mods you have installed, we need to read WorkshopFileInfos.json in your TabletopSimulator mods directory
    WorkshopFileInfos.json path:  (/Users/stefankendall/My Games/Tabletop Simulator/Mods/Workshop/WorkshopFileInfos.json)
     
Since that's correct, I hit `[ENTER]` to use the default selection. Next, I see all the mods I have installed:
    
    ...
    [56]: Secret Hitler
    [57]: Cool Custom Game Mod
    number:  
    
I enter `57` and hit `[ENTER]`. I'd like to make a full copy of all assets of `Cool Custom Game Mod` and host it on my public dropbox folder, so it can't go down because a few files go missing. I get the following prompt:

    Where would you like to save downloaded files?
    directory:  (/Users/stefankendall/Dropbox/public/games) 

This is where I'd like to copy the game, so I hit `[ENTER]` and accept the default.

    What url should be used to prefix mod files?
    e.g. https://dl.dropboxusercontent.com/u/<userid>/games
    url:  

This is the tricky part. You need to find out your dropbox public folder url. I put in my url and hit enter:
 
    https://dl.dropboxusercontent.com/u/1234EXAMPLE/games
    
In my `public` folder, I have a `games` directory where I want my backups to go. And that's it! The rest is automatic:

    downloading: http://...
    downloading: https://...
    downloading: https://...
    All files downloaded. Mod file copied to: /Users/stefankendall/Dropbox/public/games/Cool Custom Game Mod/Workshop/Cool Custom Game Mod.json
    rewriting /Users/stefankendall/Dropbox/public/games/Cool Custom Game Mod/Workshop/Cool Custom Game Mod.json with base url: https://dl.dropboxusercontent.com/u/1234EXAMPLE/games
    Mod rewrite finished
    Copying (installing) /Users/stefankendall/Dropbox/public/games/TTS Racing!/Workshop/TTS Racing!.json to /Users/stefankendall/My Games/Tabletop Simulator/Mods/Workshop/TTS Racing!.json
    Installed! Mod will appear as "Cool Custom Game Mod Backup"
    When all should be available on the public internet (i.e. synced via dropbox), run this command:
    ttsbackup validate "/Users/stefankendall/Dropbox/public/games/Cool Custom Game Mod/Workshop/Cool Custom Game Mod.json"
    
I need to wait a few seconds for the files to sync on dropbox, and when all files are done syncing, I can validate the mod:

    ttsbackup validate "/Users/stefankendall/Dropbox/public/games/Cool Custom Game Mod/Workshop/Cool Custom Game Mod.json"
    
    [OK] https://dl.dropboxusercontent.com/...
    [OK] https://dl.dropboxusercontent.com/...
    CHECKED: 24
    PASSED: 24
    FAILED: 0

Sweet! My mod is now fully backed up. When I play `Cool Custom Game Mod Backup` in Tabletop Simulator, I'm playing 100% from my own hosted files on dropbox.

All of the paths that are entered will save for the next time I run `ttsbackup`, making the next backup much simpler.
 
## Backup mods that only exist locally

Sometimes, mods get pulled before you can back them up. But that's okay! So long as you have all the mod resources locally, you should be able to recover the mod.

To recover a mod that has been taken off the store, run `ttsbackup recover`. The process is similar to the main `ttsbackup` command documented above.