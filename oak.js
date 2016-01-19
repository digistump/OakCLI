
var spark = require('spark');
var fs = require('fs');
var readlineSync = require('readline-sync');
var mkdirp = require('mkdirp');

var pathToBin;
var pathToConfig;

pathToConfig = (process.env.APPDATA + "\\oak\\" || (process.platform == 'darwin' ? process.env.HOME + 'Library/Preferences/oak/' : process.env.HOME + '.oak/'));


if(!fs.existsSync(pathToConfig+'config.json')){
	if(process.argv.length>2){
		console.log("Config file not found at: "+pathToConfig+'config.json'+" - please run the oak tool from the command line with no arguments to configure.");
		process.exit(1);
	}
	else{
		selectAccountAndDevice();
	}
}
else{

	var config = require(pathToConfig+'config.json');

	if(process.argv.length>2){
		if(process.argv.length>3){
			failAndUsage("Invalid arguments.");
		}
		//should be a file
		pathToBin = process.argv[2].trim();
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
					device.flash(pathToBin, function(err, data) {
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
	//prompt for user and password
	var userName = readlineSync.questionEMail('Particle Username/Email:');
	var password = readlineSync.question('Particle Password:', {
	  hideEchoBack: true // The typed text on screen is hidden by `*` (default). 
	});
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
		  var deviceName = device.name;
		  if(deviceName === null){
		  	deviceName = "Unnamed Device (Device ID: )"+device.id;
		  }
		  devicesList.push(deviceName);
		  idsList.push(device.id);
		}

		if(devicesList.length<1){
			console.log("No devices available.");
			process.exit(1);
		}
		var index = readlineSync.keyInSelect(devicesList, 'Which device would you like to use?');
		if(index < 0){
			console.log("Configuration canceled.")
			process.exit(0);
		}
		writeConfig(access.access_token,idsList[index]);
	});
}



function writeConfig(accessToken,deviceID){
	if(!mkdirp.sync(pathToConfig)){
		if(!fs.existsSync(pathToConfig)){
			console.log("Could not create config directory: "+pathToConfig);
        	process.exit(1);
    	}
	}
	var toWrite = JSON.stringify({"access_token":accessToken,"device_id":deviceID});
	fs.writeFile(pathToConfig+'config.json', toWrite, function(err) {
    if(err) {
        console.log("Could not write config file to: "+pathToConfig+'config.json');
        process.exit(1);
    }
    else{
    	console.log("Configuration saved. You can now use this tool to upload files to your device.");
    	process.exit(0);
    }
	}); 
}

function failAndUsage(errorText){
	console.log(errorText);
	console.log('------\nUsage:\n\toak [filename] - Upload the bin file located at filename to the selected Oak.\n\toak - Set the Particle account and Oak device to use when uploading.');
	process.exit(1);
}