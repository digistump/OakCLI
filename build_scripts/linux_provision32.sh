#!/bin/bash
curl -sL https://deb.nodesource.com/setup_5.x | sudo -E bash -
sudo apt-get install -y nodejs build-essential
sudo npm install -g nexe
cd /vagrant
source ./version.txt
npm install
mkdir -p builds/linux32/$VERSION
nexe -i ./oak.js -o ./builds/linux32/$VERSION/oak
chmod 0777 ./builds/linux32/$VERSION/oak
tar -zcvf ./builds/oak-$VERSION-linux32.tar.gz ./builds/linux32/$VERSION

