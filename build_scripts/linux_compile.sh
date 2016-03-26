#!/bin/bash
cd /vagrant
source ./version.txt
npm install
rm -r builds/$1/$VERSION
mkdir -p builds/$1/$VERSION
nexe -f -r 0.12.10 -i ./oak.js -o ./builds/$1/$VERSION/oak
chmod 0777 ./builds/$1/$VERSION/oak
cd ./builds/$1/
rm ../oakcli-$VERSION-$1.tar.gz
tar -zcvf ../oakcli-$VERSION-$1.tar.gz $VERSION

# cd ~
# curl -L "https://github.com/digistump/OakUpdateTool/archive/master.zip" -o "master.zip"
# unzip -o master.zip
# cd OakUpdateTool-master
# sudo pip install -r requirements.txt
# sudo pip install -U pyasn1
# sudo rm -r dist
# pyinstaller --onefile --noupx --hidden-import=_cffi_backend oakupsrv.py
# chmod 0777 ./dist/oakupsrv
# cd ./dist
# tar -zcvf /vagrant/builds/oakupsrv-$1.tar.gz oakupsrv