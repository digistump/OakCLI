#!/bin/bash
vagrant up ubuntu-x86
vagrant ssh ubuntu-x86 -c "cd /vagrant && ./compile.sh linux-x86"
vagrant halt ubuntu-x86

