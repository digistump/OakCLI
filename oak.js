'use strict';

var spark = require('spark');
var fs = require('fs');
var readlineSync = require('readline-sync');
var mkdirp = require('mkdirp');
var path = require('path');
var colors = require('colors');
var windows = process.platform.indexOf("win") === 0;
var os = require("os");
var program = require('commander');

program.version('0.9.6')
  .usage('[-d deviceName] <binary file to upload>')
  .option('-d, --device <device name>', 'target device name')
  .parse(process.argv);


var pathToBin;
var pathToConfig;
var config;
var progressBarInterval;
var flashTimeout;
var rebootTimeout;
var flashSuccessfull = false;
var rebooting = false;
var activeDeviceIndex = -1;


function clear() {
  var i,lines;
  var stdout = '';
  
  if (windows === false) {
    stdout += '\x1B[2J';
  } else {
    lines = process.stdout.getWindowSize()[1];
    
    for (i=0; i<lines; i++) {
      stdout += os.EOL;
    }
  }
  // Reset cursur
  stdout += '\x1B[0f';
  process.stdout.write(stdout);
}

function loadConfig() {
  try {
    var config_contents = fs.readFileSync(pathToConfig + 'config.json', 'utf8');
    config = JSON.parse(config_contents);
    // try to recover from old config file format
    if (config.devices === undefined) {
      // build the new config var
      var newConfig = {	
        access_token: config.access_token,
        devices : []
      };
      // extract the new device name format
      var newDeviceName = config.device_name.split('(');
      if (newDeviceName.length == 0) {
        return false;
      }
      newConfig.devices.push({'device_id' : newDeviceName[0].trim(), 'device_name' : config.device_name, 'active' : true});		
      config = newConfig;
    }
    if (program.device != undefined) {
      // find device by name
      for(var deviceId in config.devices) {
        if (config.devices[deviceId].device_name == program.device) {
          activeDeviceIndex = deviceId;
          break;
        }
      }
    } else {
      // get the active device
      for(deviceId in config.devices) {
        if (config.devices[deviceId].active === true) {
          activeDeviceIndex = deviceId;
          break;
        }
      }
    }
    if (activeDeviceIndex == -1) {
      return false;
    }
    return true;
  }
  catch(e){
    return false;
  }
}

function loginOrFail() {
  if (program.args.length == 1) {
    errorAndQuit('Config file not found at: ' + pathToConfig + 'config.json - please run the oak tool from the command line with no arguments to configure.');
  }
  else{
    particleLogin();
  }
}

//pathToConfig = (process.env.APPDATA + "\\oak\\" || (process.platform == 'darwin' ? process.env.HOME + 'Library/Preferences/oak/' : process.env.HOME + '.oak/'));
pathToConfig = '~/';
if (process.platform == 'linux' || process.platform == 'freebsd') {
  pathToConfig = process.env.HOME + '/.oak/';
} else if(process.platform == 'win32') {
  pathToConfig = process.env.APPDATA + '\\oak\\';
} else if(process.platform == 'darwin') {
  pathToConfig = process.env.HOME + '/Library/Preferences/oak/';
}

if (!loadConfig()) {
  loginOrFail();
} else {
  if (program.args.length == 1) {
    //should be a file
    pathToBin = program.args[0].trim();

    if (!fs.existsSync(pathToBin)) {
      failAndUsage("Invalid file name.");
    } else {
      spark.login({accessToken: config.access_token}, function(err, data) {
        if (err) {
          fs.unlinkSync(pathToConfig+'config.json');
          errorAndQuit('Your access token has expired, please run this tool from the command line to get a new token.');
        }
        spark.getDevice(config.devices[activeDeviceIndex].device_id, function(err, device) {
          if (err) {
            fs.unlinkSync(pathToConfig+'config.json');
            errorAndQuit('Selected device is no longer available on this account, please run this tool from the command line to select a device.');
          }
  
          console.log('Using config file at: ' + pathToConfig + 'config.json');
  
          var onlyPath = path.dirname(pathToBin);
          var onlyFile = path.basename(pathToBin);
          process.chdir(onlyPath);
          console.log('Sending file to cloud, to flash ' + config.devices[activeDeviceIndex].device_name + ' (Device ID: ' + config.devices[activeDeviceIndex].device_id + ')');
          device.flash([onlyFile], function(err, data) {
            if (err) {
              errorAndQuit('An error occurred while flashing the device:' + err);
            } else {
              process.stdout.write("Flashing.");
              progressBarInterval = setInterval(progressBar, 1000);
              flashTimeout = setTimeout(onFlashTimeout, 60 * 1 * 1000); // flash timeout : 1 minute
              spark.getEventStream(null, config.device_id, function(data) {
                var eventData = data.data.trim();
                if (data.name == 'spark/flash/status') {
                  clearInterval(progressBarInterval);
                  clearTimeout(flashTimeout);
                  
                  if (eventData == 'success') {
                    flashSuccessfull = true;
                    console.log('Done.');
                    rebootTimeout = setTimeout(onRebootTimeout, 30 * 1 * 1000); // reboot start timeout : 30 seconds
                  } else if (eventData == 'failed') {
                    // there is a bug in particle cloud : sometimes 'spark/flash/status'
                    // return 'failed' but flash is ok
                    // so wait for reboot
                    flashSuccessfull = true;
                    console.log('Failed but perhaps success.');
                    rebootTimeout = setTimeout(onRebootTimeout, 30 * 1 * 1000); // reboot start timeout : 30 seconds
                    //errorAndQuit('Flash failed');
                  }
                }
                if (data.name == 'spark/status') {
                  if (eventData == 'offline') {
                    if (flashSuccessfull === false) {
                      errorAndQuit('Oak is gone before flash sucessfull.');
                    }
                    rebooting = true;
                    clearTimeout(rebootTimeout);
                    rebootTimeout = setTimeout(onRebootTimeout, 60 * 1 * 1000); // online again timeout : 1 minutes
                    process.stdout.write('Rebooting Oak');
                    progressBarInterval = setInterval(progressBar, 1000);
                  }
                  if (eventData == 'online') {
                    if (rebooting == false) {
                      errorAndQuit('Oak is back before flash sucessfull.');
                    }					    	
                    clearTimeout(rebootTimeout);
                    clearInterval(progressBarInterval);
                    console.log(os.EOL + 'Oak Ready');
                    process.exit(0);
                  }
                }
              });
            }
          });
        });
      });
    }
  } else {
    //go to config
    selectAccountAndDevice();
  }
}

function onFlashTimeout() {
  clearInterval(progressBarInterval);
  errorAndQuit('Flash timeout - flash failed.');
}

function onRebootTimeout() {
  clearInterval(progressBarInterval);
  errorAndQuit('Reboot timeout - flash likely failed.');
}


function progressBar() {
  process.stdout.write('.');
}

function selectAccountAndDevice() {
  console.log("Logging in to Particle...".green);
  spark.login({accessToken: config.access_token}, function(err, data) {
    if (err) {
      console.log('Your access token has expired, please login.');
      fs.unlinkSync(pathToConfig + 'config.json');
      particleLogin();
    }	else {
      loginCallback(false, config);
    }
  });
}

function particleLogin() {
  clear();
  //prompt for user and password
  var userName = readlineSync.questionEMail('Particle Username/Email:');
  var password = readlineSync.question('Particle Password:', {
    hideEchoBack: true // The typed text on screen is hidden by `*` (default). 
  });
  console.log('Logging in to Particle...'.green);
  spark.login({username: userName.trim(), password: password.trim()},loginCallback);

}

function loginCallback(err, access) {
  //get devices
  if (err) {
    console.log('Invalid username or password.'.red);
    readlineSync.question('Press enter to exit.');
    process.exit(1);
  }
  var devicesList = [];
  var idsList = [];
  var device;
  spark.listDevices(function(err, devices) {
    if(err || devices === null || devices.length == 0) {
      console.log('No devices available.'.red);
      readlineSync.question('Press enter to exit.');
      process.exit(1);
    }

    for (var i in devices) {
      device = devices[i];
      var deviceName;
      if (device.name === null) {
        deviceName = 'Unnamed Device';
      } else {
        deviceName = device.name;
      }
      
      devicesList.push(deviceName + ' (Device ID: ' + device.id + ')');
      idsList.push(device.id);
    }

    devicesList.push('------------------------');
    devicesList.push('Switch Particle Accounts');
    var selectedDevice = null;
    if (config !== undefined) {
      if (config.devices[activeDeviceIndex].device_name !== undefined && activeDeviceIndex != -1 && config.devices[activeDeviceIndex].device_name !== undefined) {
        selectedDevice = config.devices[activeDeviceIndex].device_name + ' (Device ID: ' + config.devices[activeDeviceIndex].device_id + ')';
      }
    }

    clear();
    while (1) {
      var index;
      if(selectedDevice == null) {
        index = readlineSync.keyInSelect(devicesList, 'Which device would you like to use?', {cancel: 'Exit'});
      } else {
        console.log("Currently selected device: ".yellow.bold+selectedDevice.cyan.bold);
        index = readlineSync.keyInSelect(devicesList, 'Select a device to switch active devices:', {cancel: 'Exit'});
      }
      if (index < 0) {
        process.exit(0);
      } else if (devicesList[index] == '------------------------') {
        clear();
        continue;
      } else if (devicesList[index] == 'Switch Particle Accounts') {
        particleLogin();
        return;
      } else {
        console.log('Saving');
        selectedDevice = devicesList[index];
        if (writeConfig(access.access_token, devices, idsList, index)) {
          clear();
          console.log('Configuration saved at ' + pathToConfig + 'config.json');
          console.log('You can now upload files to this device.'.green.bold);
        } else {
          console.log('Could not write config file to: ' + pathToConfig + 'config.json');
        }
      }
    }
  });
}

function writeConfig(accessToken, devices, idsList, selectedDeviceIndex) {
  if (!mkdirp.sync(pathToConfig)) {
    if (!fs.existsSync(pathToConfig)) {
      console.log('Could not create config directory: '.red + pathToConfig.red);
      readlineSync.question('Press enter to exit.');
      process.exit(1);
    }
  }
  var toWrite = {
    access_token: accessToken,
    devices : []
  };
  for (var i in devices) {
    toWrite.devices.push({'device_id' : idsList[i], 'device_name' : devices[i].name === null ? 'Unnamed Device' : devices[i].name, 'active' : (i == selectedDeviceIndex ? true : false)});		
  }				
  try {
    fs.writeFileSync(pathToConfig+'config.json', JSON.stringify(toWrite, null, 2));
  }	catch(e) {
    return false;
  }
  return true;
}

function failAndUsage(errorText){
  console.log(errorText);
  console.log('------');
  console.log('Usage:');
  console.log('\toak [-d device name] filename - Upload the \'filename\' binary file to the \'device_name\' oak or to the default selected Oak.');
  console.log('\toak - Set the Particle account and default Oak device to use when uploading.');
  process.exit(1);
}

function errorAndQuit(errorMessage) {
  console.log(os.EOL + 'Error'.red + ' : ' + errorMessage);
  process.exit(1);
}