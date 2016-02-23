#!/bin/bash
vagrant up ubuntu-x64
vagrant ssh ubuntu-x64 -c "cd /vagrant && ./compile.sh linux-x64"
vagrant halt ubuntu-x64

