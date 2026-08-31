# ceyecetify
This is a WIP version of my custom Spicetify theme. You'll get a dynamic color palette based on your current song, a simplified design, and lots more!


## Before Installing
* Install the `ceyectify_without_updates.js` if you want to use "ceyectify" with a specific version
* Install the `ceyectify_with_updates.js` if you want to automatically use the latest "ceyectify" version

&nbsp;

## Installation
❗IMPORTANT: currently works better on Mac, but Windows and Linux will be supported soon! Live updates also just kinda works (it doesn't)

#### On Mac:
1. Download the Version that you want to use
2. Navigate to `~/.config/spicetify/Extensions` and place the "ceyectify" script there
3. Run `spicetify config extensions ceyectify_with_updates.js` or `spicetify config extensions ceyectify_without_updates.js`, depending on which version you want to use
4. Run `spicetify apply`
5. Enjoy ;)

#### On Windows:
Open PowerShell and run
```
powershell -Command "irm 'https://raw.githubusercontent.com/ceyedev/ceyecetify/refs/heads/main/install.ps1' | iex"
```

&nbsp;

## Remove ceyecetify
If you decide you don't want to use "ceyecetify" anymore, you can remove it like that:

#### On Mac:
1. Navigate to `~/.config/spicetify/Extensions`
2. Run `spicetify config extensions ceyectify_with_updates.js-` or `spicetify config extensions ceyectify_without_updates.js-`, depending on which version you installed
3. Delete the file
4. Run `spicetify apply`

#### On Windows:
Open PowerShell and run
```
powershell -Command "irm 'https://raw.githubusercontent.com/ceyedev/ceyecetify/refs/heads/main/uninstall.ps1' | iex"
```
