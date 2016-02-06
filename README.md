# OakCLI
## The Oak command line upload tool

**Download:** 
- [Windows](https://github.com/digistump/OakCLI/releases/download/0.9.1/oakcli-0.9.1-win32.zip)
- [Mac OSX](https://github.com/digistump/OakCLI/releases/download/0.9.1/oakcli-0.9.1-osx.zip)
- [Linux 32bit](https://github.com/digistump/OakCLI/releases/download/0.9.1/oakcli-0.9.1-linux32.tar.gz)
- [Linux 64bit](https://github.com/digistump/OakCLI/releases/download/0.9.1/oakcli-0.9.1-linux64.tar.gz)

**Usage: oak [filename]**

**oak [filename]** Uploads the bin file at [filename] to the Oak via the Particle Cloud using the credentials and device currently selected. Quits with error is no credentials previously provided or access token has expired.

**oak** If not yet logged in, or access token has expired - accepts credentials for Particle Cloud, fetches access token, then presents a list of devices on your account to choose from. If it already has a valid access token it will go straight to the list. Selecting a device saves the selected device id and access_token to the config file, so any initiated uploads will go to that device. Remains in device selection loop so you can quickly change devices, exit, or change accounts.

## Build Process
 - Install node.js
 - Install python
 - "npm install -g nexe"
 - Clone this repository, cd to it
 - "npm install"
 - "nexe -i ./oak.js -o ./oak"


