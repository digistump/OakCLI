#!/bin/bash
cd /vagrant
source ./version.txt
npm install
mkdir -p builds/$1/$VERSION
nexe -i ./oak.js -o ./builds/$1/$VERSION/oak
chmod 0777 ./builds/$1/$VERSION/oak
tar -zcvf ./builds/oak-$VERSION-$1.tar.gz ./builds/$1/$VERSION

