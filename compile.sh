#!/bin/bash
npm install
mkdir -p output/$1
nexe -i ./oak.js -o ./output/$1/oak-$1
zip oak-$1.zip ./output/$1/oak-$1

