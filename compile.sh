#!/bin/bash
npm install
mkdir -p output/$1
nexe -i ./oak.js -o ./output/$1/oak-linux-$1
zip oak-linux-$1.zip ./output/$1/oak-linux-$1

