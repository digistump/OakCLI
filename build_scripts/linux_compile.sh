#!/bin/bash
cd /vagrant
source ./version.txt
npm install
rm -r builds/$1/$VERSION
mkdir -p builds/$1/$VERSION
nexe -r 0.12.10 -i ./oak.js -o ./builds/$1/$VERSION/oak
chmod 0777 ./builds/$1/$VERSION/oak
cd ./builds/$1/
rm ../oakcli-$VERSION-$1.tar.gz
tar -zcvf ../oakcli-$VERSION-$1.tar.gz $VERSION
