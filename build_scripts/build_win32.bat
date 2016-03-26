cd %~dp0%
cd ../
set zipcmd=%~dp0%tools\zip
set builds=%~dp0%..\builds
echo %zipcmd%
set /p str=<version.txt
set str=%str:"=%
set str=%str: =%
set str=%str:VERSION=%
set str=%str:~1%
call npm install
rmdir /Q /S builds\win32\%str%
mkdir builds\win32\%str%
call nexe -f -r 0.12.10 -i ./oak.js -o ./builds/win32/%str%/oak.exe
cd builds/win32
del "../oakcli-%str%-win32.zip"
%zipcmd% -r ../oakcli-%str%-win32.zip %str%

del "../oakupsrv-win32.zip"
cd C:\OakUpdateTool
pip install -r requirements.txt
pyinstaller --onefile --noupx --hidden-import=_cffi_backend oakupsrv.py
cd dist
%zipcmd% -r %builds%\oakupsrv-win32.zip oakupsrv.exe
cd %~dp0%