cd ../
vagrant up ubuntu-x86
vagrant ssh ubuntu-x86 -c "/vagrant/build_scripts/nix_compile.sh linux32"
vagrant halt ubuntu-x86
pause