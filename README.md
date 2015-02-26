# channelPLAY Template Creator
### Self contained application to create skin templates for the channelPLAY Platform

## Installation
1. Clone the repository and `cd` into the directory
2. Install npm (node) modules: 
	`npm install`
3. Install bower dependencies 
	`bower install`

#### For development (uses gulp to auto compile and serve to port 3000):
4. Start gulp: 
	`gulp`
5. View in browser at http://localhost:3000

#### For Production (deploys to firebase):
4. install firebase tools: 
	`sudo npm install -g firebase-tools`
5. Deploy : 
	`firebase deploy`




# Troubleshooting Setup (OS X):

### NPM throws errors / says I don't have permission and to use sudo
Woah, stop right there. Npm should never require sudo for local modules, you've got yourself a permissions issue! 
Fix this by executing `sudo chown -R $(whoami) ~/.npm` to give npm the right permissions to your system.

### The Gulp command does not work!
If the `gulp` command is not recognised, it's probably never been installed on your machine.
Use `npm install -g gulp` and `npm install -g gulp-sass` to make these modules avaliable from the command line.

### Gulp works but gulp-sass throws an error and won't compile
This is probably because gulp-sass only supports up to node v0.10.33. See bellow:

### Do I have the right version of Node?
Gulp-sass requires node v0.10.33, check you have the right version using:
`node -v'

