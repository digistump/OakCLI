# OakCLI
## The Oak command line upload tool

**Download:** 
- [Windows](https://github.com/digistump/OakCLI/releases/download/0.9.4/oakcli-0.9.4-win32.zip)
- [Mac OSX](https://github.com/digistump/OakCLI/releases/download/0.9.4/oakcli-0.9.4-osx.tar.gz)
- [Linux 32bit](https://github.com/digistump/OakCLI/releases/download/0.9.4/oakcli-0.9.4-linux32.tar.gz)
- [Linux 64bit](https://github.com/digistump/OakCLI/releases/download/0.9.4/oakcli-0.9.4-linux64.tar.gz)

**Usage: oak [filename]**

**oak [filename]** Uploads the bin file at [filename] to the Oak via the Particle Cloud using the credentials and device currently selected. Quits with error is no credentials previously provided or access token has expired.

**oak** If not yet logged in, or access token has expired - accepts credentials for Particle Cloud, fetches access token, then presents a list of devices on your account to choose from. If it already has a valid access token it will go straight to the list. Selecting a device saves the selected device id and access_token to the config file, so any initiated uploads will go to that device. Remains in device selection loop so you can quickly change devices, exit, or change accounts.

## Building from source

### Linux

**If using Ubuntu 12.04 or earlier, or similar - node requires g++4.8 or higher**
1. sudo add-apt-repository ppa:ubuntu-toolchain-r/test
2. sudo apt-get update
3. sudo apt-get install -y gcc-4.8 g++-4.8
4. sudo update-alternatives --install /usr/bin/gcc gcc /usr/bin/gcc-4.8 60 --slave /usr/bin/g++ g++ /usr/bin/g++-4.8
5. sudo update-alternatives --install /usr/bin/gcc gcc /usr/bin/gcc-4.6 40 --slave /usr/bin/g++ g++ /usr/bin/g++-4.6

**After those steps or if using 14.04 or similar or higher**
1. curl -sL https://deb.nodesource.com/setup_5.x | sudo -E bash -
2. sudo apt-get install -y nodejs build-essential
3. sudo npm install -g nexe`
4. `git clone https://github.com/digistump/OakCLI`
5. `cd OakCLI`
6. `nexe -r 0.12.10 -i ./oak.js -o ./oak`

### OSX

1. Install homebrew
2. `brew install node`
3. `npm install -g nexe`
4. `git clone https://github.com/digistump/OakCLI`
5. `cd OakCLI`
6. `nexe -r 0.12.10 -i ./oak.js -o ./oak`

### Windows

1. Install node.js (http://nodejs.org)
2. Install python 2.7 (https://www.python.org/ftp/python/2.7.11/python-2.7.11.msi)
3. Install Visual C++ Build Tools (https://www.visualstudio.com/en-us/downloads/download-visual-studio-vs.aspx, download community edition, install C++ Command Line Build Tools and C++, no need to register it)
4. Install git (or download zip of this repository and unzip)
5. `npm install -g nexe`
6. `git clone https://github.com/digistump/OakCLI`
7. `cd OakCLI`
8. `npm install`
9. `nexe -r 0.12.10 -i ./oak.js -o ./oak.exe`
