cd %~dp0%
cd ../
vagrant up ubuntu-x86
vagrant ssh ubuntu-x86 -c "/vagrant/build_scripts/linux_compile.sh linux32"
vagrant halt ubuntu-x86
cd %~dp0%
pause