#!/bin/bash
cd ../
vagrant up ubuntu-x64
vagrant ssh ubuntu-x64 -c "/vagrant/build_scripts/nix_compile.sh linux64"
vagrant halt ubuntu-x64

