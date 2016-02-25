cd %~dp0%
cd ../
vagrant up ubuntu-x64
vagrant ssh ubuntu-x64 -c "/vagrant/build_scripts/linux_compile.sh linux64"
vagrant halt ubuntu-x64
cd %~dp0%

