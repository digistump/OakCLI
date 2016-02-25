#! /bin/sh
#don't remove so that we save rebuilding the whole chain when possible - sudo rm -r OakCLI-master
sudo rm master.zip
curl -L "https://github.com/digistump/OakCLI/archive/master.zip" -o "master.zip"
unzip -o master.zip
cd OakCLI-master
npm install
sudo rm -r builds/osx/$1
mkdir -p builds/osx/$1
nexe -r 0.12.10 -i ./oak.js -o ./builds/osx/$1/oak
chmod 0777 ./builds/osx/$1/oak
cd ./builds/osx/
sudo rm ../oakcli-$1-osx.tar.gz
tar -zcvf ../oakcli-$1-osx.tar.gz $1
cd ../../
curl -T "./builds/oakcli-$1-osx.tar.gz" "ftp://username:password@$2/builds/"