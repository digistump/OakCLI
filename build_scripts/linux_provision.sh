#!/bin/bash
sudo add-apt-repository -y ppa:fkrull/deadsnakes-python2.7
sudo add-apt-repository -y ppa:ubuntu-toolchain-r/test
sudo apt-get update 
sudo apt-get install -y nodejs build-essential gcc-4.8 g++-4.8 python2.7 python2.7-dev python-pip unzip libffi-dev
sudo update-alternatives --install /usr/bin/gcc gcc /usr/bin/gcc-4.8 60 --slave /usr/bin/g++ g++ /usr/bin/g++-4.8
sudo update-alternatives --install /usr/bin/gcc gcc /usr/bin/gcc-4.6 40 --slave /usr/bin/g++ g++ /usr/bin/g++-4.6
curl -sL https://deb.nodesource.com/setup_5.x | sudo -E bash -
sudo apt-get install -y nodejs build-essential git
sudo npm install -g nexe
sudo pip install pyinstaller
