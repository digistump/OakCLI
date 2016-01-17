# OakOTA 

Usage: oak_ota [filename | login]

**oak_ota [filename]** Uploads the bin file at [filename] to the Oak via the Particle Cloud using the credentials and device previously provided. Quits with error is no credentials previously provided or access token has expired.

**oak_ota login** Accepts credentials for Particle Cloud, fetches access token and saves token to .oak_ota file in same directory, then presents a list of devices on your account to choose from. 

**oak_ota** If no .oak_ota config file exists, then mimics the behavior of "oak_ota login" otherwise presents a list of devices on your account to choose from. 
