#!/bin/bash
source ./version.txt
npm install
mkdir -p output/$1/$VERSION
nexe -i ./oak.js -o ./output/$1/$VERSION/oak
chmod 0777 ./output/$1/$VERSION/oak
tar -zcvf oak-$VERSION-$1.tar.gz ./output/$1/$VERSION

