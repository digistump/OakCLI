cd %~dp0%
cd ../
set zipcmd=%~dp0%tools\zip
echo %zipcmd%
set /p str=<version.txt
set str=%str:"=%
set str=%str: =%
set str=%str:VERSION=%
set str=%str:~1%
call npm install
rmdir /Q /S builds\win32\%str%
mkdir builds\win32\%str%
call nexe -r 0.12.10 -i ./oak.js -o ./builds/win32/%str%/oak.exe
cd builds/win32
del "../oakcli-%str%-win32.zip"
%zipcmd% -r ../oakcli-%str%-win32.zip %str%
cd %~dp0%