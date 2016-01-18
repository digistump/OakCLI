# OakCLI
## The Oak command line upload tool

Usage: oak [filename]

**oak [filename]** Uploads the bin file at [filename] to the Oak via the Particle Cloud using the credentials and device previously provided. Quits with error is no credentials previously provided or access token has expired.

**oak** Accepts credentials for Particle Cloud, fetches access token, then presents a list of devices on your account to choose from. Saves selected device id and access_token to config file.
