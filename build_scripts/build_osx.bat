cd %~dp0%
ipconfig | findstr /R /C:"IPv4 Address" | findstr /R /C:"192.168.1" > ip.txt
set /p ipstr=<ip.txt
del ip.txt
set ipstr=%ipstr: =%
set ipstr=%ipstr:IPv4Address...........:=%
set "newDir=%~dp0\..\"
cd tools
start /min ftpdmin.exe %newDir%
cd ../../
set /p str=<version.txt
set str=%str:"=%
set str=%str: =%
set str=%str:VERSION=%
set str=%str:~1%
rmdir /Q /S builds\osx\%str%
mkdir builds\osx\%str%
cd builds
del "oakcli-%str%-osx.tar.gz"
del "oakupsrv-osx.tar.gz"
cd ../
vagrant up osx
vagrant ssh osx -c "curl \"ftp://%ipstr%/build_scripts/osx_compile.sh\" -o \"osx_compile.sh\" && chmod 0777 ./osx_compile.sh && ./osx_compile.sh %str% %ipstr%"
vagrant halt osx
taskkill /f /im ftpdmin.exe
cd %~dp0%
pause