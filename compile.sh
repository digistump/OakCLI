#!/bin/bash
source ./version.txt
npm install
mkdir -p output/$1/$VERSION
nexe -i ./oak.js -o ./output/$1/$VERSION/oak
zip oak-$VERSION-$1.zip ./output/$1/$VERSION

