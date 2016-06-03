#!/bin/bash
#cd /vagrant
#source ./version.txt
#npm install
#rm -r builds/$1/$VERSION
#mkdir -p builds/$1/$VERSION
#nexe -f -r 0.12.10 -i ./oak.js -o ./builds/$1/$VERSION/oak
#chmod 0777 ./builds/$1/$VERSION/oak
#./builds/$1/$VERSION/oak -V
#cd ./builds/$1/
#rm ../oakcli-$VERSION-$1.tar.gz
#tar -zcvf ../oakcli-$VERSION-$1.tar.gz $VERSION
sudo rm -r ~/oak
mkdir -p ~/oak
cd ~/oak
git clone https://github.com/digistump/OakCLI
cd OakCLI
source ./version.txt
npm install
mkdir -p $VERSION
nexe -f -r 0.12.10 -i ./oak.js -o ./$VERSION/oak
chmod 0777 ./$VERSION/oak
tar -zcvf ./oakcli-$VERSION-$1.tar.gz $VERSION
cp ./oakcli-$VERSION-$1.tar.gz /vagrant/builds/
sudo rm -r ~/oak
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