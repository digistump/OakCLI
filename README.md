# OakCLI
## The Oak command line upload tool

**Download:** 
- [Windows](https://github.com/digistump/OakCLI/releases/download/0.9.3/oakcli-0.9.3-win32.zip)
- [Mac OSX](https://github.com/digistump/OakCLI/releases/download/0.9.3/oakcli-0.9.3-osx.tar.gz)
- [Linux 32bit](https://github.com/digistump/OakCLI/releases/download/0.9.3/oakcli-0.9.3-linux32.tar.gz)
- [Linux 64bit](https://github.com/digistump/OakCLI/releases/download/0.9.3/oakcli-0.9.3-linux64.tar.gz)

**Usage: oak [filename]**

**oak [filename]** Uploads the bin file at [filename] to the Oak via the Particle Cloud using the credentials and device currently selected. Quits with error is no credentials previously provided or access token has expired.

**oak** If not yet logged in, or access token has expired - accepts credentials for Particle Cloud, fetches access token, then presents a list of devices on your account to choose from. If it already has a valid access token it will go straight to the list. Selecting a device saves the selected device id and access_token to the config file, so any initiated uploads will go to that device. Remains in device selection loop so you can quickly change devices, exit, or change accounts.

## Build Process

### Linux x86

1. Install Vagrant
2. `./build_linux_x86.sh`
3. Enjoy `oak-linux-x86.zip`

### Linux x64
1. Install Vagrant
2. `./build_linux_x64.sh`
3. Enjoy `oak-linux-x64.zip`

### OSX

1. Install homebrew
2. `brew install node`
3. `npm install -g nexe`
4. `git clone https://github.com/digistump/OakCLI`
5. `cd OakCLI`
6. `./compile.sh osx`
7. Enjoy `oak-osx.zip`

### Windows

 - Install node.js
 - Install python
 - "npm install -g nexe"
 - Clone this repository, cd to it
 - "npm install"
 - "nexe -i ./oak.js -o ./oak"
 