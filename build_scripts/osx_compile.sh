#! /bin/sh
#don't remove so that we save rebuilding the whole chain when possible - sudo rm -r OakCLI-master
#these are for the updater package
sudo easy_install pip
sudo pip install pyinstaller
#these are for the OakCLI
sudo rm master.zip
curl -L "https://github.com/digistump/OakCLI/archive/master.zip" -o "master.zip"
unzip -o master.zip
cd OakCLI-master
npm install
sudo rm -r builds/osx/$1
mkdir -p builds/osx/$1
nexe -f -r 0.12.10 -i ./oak.js -o ./builds/osx/$1/oak
chmod 0777 ./builds/osx/$1/oak
cd ./builds/osx/
sudo rm ../oakcli-$1-osx.tar.gz
tar -zcvf ../oakcli-$1-osx.tar.gz $1
cd ../../
curl -T "./builds/oakcli-$1-osx.tar.gz" "ftp://username:password@$2/builds/"

curl -L "https://github.com/digistump/OakUpdateTool/archive/master.zip" -o "master.zip"
unzip -o master.zip
cd OakUpdateTool-master
sudo pip install -r requirements.txt
sudo rm -r dist
pyinstaller --onefile --noupx --hidden-import=_cffi_backend oakupsrv.py
chmod 0777 ./dist/oakupsrv
cd ./dist
tar -zcvf ./oakupsrv-osx.tar.gz oakupsrv
curl -T "./oakupsrv-osx.tar.gz" "ftp://username:password@$2/builds/"

# brew update
# brew install openssl
# brew link openssl --force 
# sudo rm /usr/bin/openssl
# sudo ln -s /usr/local/Cellar/openssl/1.0.2f/bin/openssl /usr/bin/openssl
# brew install python --with-brewed-openssl  
# sudo rm /usr/bin/python
# sudo rm /usr/local/bin/python 
# sudo ln -s /usr/local/Cellar/python/2.7.11/bin/python /usr/local/bin/python
# sudo ln -s /usr/local/Cellar/python/2.7.11/bin/python /usr/bin/python
