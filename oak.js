
var spark = require('spark');
var fs = require('fs');
var readlineSync = require('readline-sync');
var mkdirp = require('mkdirp');
var path = require('path');
var colors = require('colors');
var pathToBin;
var pathToConfig;
var windows = process.platform.indexOf("win") === 0;
var config;

function clear()
{
	var i,lines;
	var stdout = "";
	
	if (windows === false)
	{
		stdout += "\x1B[2J";
	}
	else
	{
		lines = process.stdout.getWindowSize()[1];
		
		for (i=0; i<lines; i++)
		{
			stdout += "\r\n";
		}
	}
	
	// Reset cursur
	stdout += "\x1B[0f";
	
	process.stdout.write(stdout);
}

function loadConfig(){
	try{
		config = require(pathToConfig+'config.json');
		return true;
	}
	catch(e){
		return false;
	}
}

function loginOrFail(){
	if(process.argv.length>2){
		console.log("Config file not found at: "+pathToConfig+'config.json'+" - please run the oak tool from the command line with no arguments to configure.");
		process.exit(1);
	}
	else{
		particleLogin();
	}
}

//pathToConfig = (process.env.APPDATA + "\\oak\\" || (process.platform == 'darwin' ? process.env.HOME + 'Library/Preferences/oak/' : process.env.HOME + '.oak/'));
pathToConfig = '~/';
if (process.platform == 'linux' || process.platform == 'freebsd') {
	pathToConfig = process.env.HOME + '/.oak/';
}
else if(process.platform == 'win32') {
	pathToConfig = process.env.APPDATA + "\\oak\\";
}
else if(process.platform == 'darwin') {
	pathToConfig = process.env.HOME + '/Library/Preferences/oak/';
}

if(!fs.existsSync(pathToConfig+'config.json')){
		loginOrFail();
}
else{

	if(!loadConfig()){
		loginOrFail();
	}
	else if(process.argv.length>2){
		if(process.argv.length>3){
			failAndUsage("Invalid arguments.");
		}
		//should be a file
		pathToBin = process.argv[2].trim();
		//console.log(pathToBin);
		if(!fs.existsSync(pathToBin)){
			failAndUsage("Invalid file name.");
		}
		else{
			spark.login({accessToken: config.access_token},function(err, data){

				//todo get device, handle errors
				if(err){
					console.log('Your access token has expired, please run this tool from the command line to get a new token.');
				    fs.unlinkSync(pathToConfig+'config.json');
				    process.exit(1);
				}
				spark.getDevice(config.device_id, function(err, device) {
					if(err){
						console.log('Selected device is no longer available on this account, please run this tool from the command line to select a device.');
					    fs.unlinkSync(pathToConfig+'config.json');
					    process.exit(1);
					}

					var onlyPath = path.dirname(pathToBin);
					var onlyFile = path.basename(pathToBin);
					process.chdir(onlyPath);
					console.log('Sending file to cloud, to flash to device...');
					device.flash([onlyFile], function(err, data) {
					  if (err) {
					    console.log('An error occurred while flashing the device:', err);
					    process.exit(1);
					  } else {
					    console.log('Device flashing started successfully.');
					    process.exit(0);
					  }
					});
				});
			});
		}
	}
	else{
		//go to config
		selectAccountAndDevice();
	}
}

function selectAccountAndDevice(){
	console.log("Logging in to Particle...".green);
	spark.login({accessToken: config.access_token},function(err, data){
		//todo get device, handle errors
		if(err){
			console.log('Your access token has expired, please login.');
	    	fs.unlinkSync(pathToConfig+'config.json');
	    	particleLogin();
		}
		else{
				loginCallback(false,config);
		}
	});
}

function particleLogin(){
	clear();
	//prompt for user and password
	var userName = readlineSync.questionEMail('Particle Username/Email:');
	var password = readlineSync.question('Particle Password:', {
	  hideEchoBack: true // The typed text on screen is hidden by `*` (default). 
	});
	console.log("Logging in to Particle...".green);
	spark.login({username: userName.trim(), password: password.trim()},loginCallback);

}



function loginCallback(err,access){
	//get devices
	if(err){
		console.log("Invalid username or password.");
		process.exit(1);
	}
	var devicesList = [];
	var idsList = [];
	var device;
	spark.listDevices(function(err, devices) {
		if(err || devices === null){
			console.log("No devices available.");
			process.exit(1);
		}

		for (var i in devices) {
		  device = devices[i];
		  var deviceName;
		  if(deviceName === null){
		  	deviceName = "Unnamed Device (Device ID: "+device.id+")";
		  }
		  else{
		  	deviceName = device.name+" (Device ID: "+device.id+")";
		  }
		  devicesList.push(deviceName);
		  idsList.push(device.id);
		}

		if(devicesList.length<1){
			console.log("No devices available.");
			process.exit(1);
		}

		devicesList.push("------------------------");
		devicesList.push("Switch Particle Accounts");
		var selectedDevice = null;
		if(config !== undefined){
			if(config.device_name !== undefined){
				selectedDevice = config.device_name;
			}
		}

		clear();
		while(1){
			var index;
			if(selectedDevice == null){
				index = readlineSync.keyInSelect(devicesList, 'Which device would you like to use?', {cancel: 'Exit'});
			}
			else{
				console.log("Currently selected device: ".yellow.bold+selectedDevice.cyan.bold);
				index = readlineSync.keyInSelect(devicesList, 'Select a device to switch active devices:', {cancel: 'Exit'});
			}
			if(index < 0){
				process.exit(0);
			}
			else if(devicesList[index] == "------------------------"){
				clear();
				continue;
			}
			else if(devicesList[index] == "Switch Particle Accounts"){
				particleLogin();
				return;
			}
			else{
				console.log("Saving");
				selectedDevice = devicesList[index];
				if(writeConfig(access.access_token,idsList[index],selectedDevice)){
					clear();
					console.log("Configuration saved. You can now upload files to this device.".green.bold);
					console.log(" ");
				}
				else{
					console.log("Could not write config file to: "+pathToConfig+'config.json');
				}
			}
		}
	});
}



function writeConfig(accessToken,deviceID,deviceName){
	if(!mkdirp.sync(pathToConfig)){
		if(!fs.existsSync(pathToConfig)){
			console.log("Could not create config directory: "+pathToConfig);
        	process.exit(1);
    	}
	}
	var toWrite = JSON.stringify({"access_token":accessToken,"device_id":deviceID,"device_name":deviceName});
	try{
		fs.writeFileSync(pathToConfig+'config.json', toWrite);
	}
	catch(e){
		return false;
	}
	return true;
}

function failAndUsage(errorText){
	console.log(errorText);
	console.log('------\nUsage:\n\toak [filename] - Upload the bin file located at filename to the selected Oak.\n\toak - Set the Particle account and Oak device to use when uploading.');
	process.exit(1);
}
