# The JEAN Stack
### Boilerplate for front end web development using jquery, express, angular and node.
This stack is for the humble web design/developer who wants to use the magic of angular/node without a database. There's no templating languages to learn, no databases to interface; it's plain old HTML, mixed with modern SCSS and Angular.

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

#### For Production (serves the public folder to port 8080):
4. Start up the server: 
	`node server.js`
5. View in browser at http://localhost:8080
6. Optionally use `forever` to keep the server running after shell is close




# Troubleshooting Setup (OS X):

### NPM throws errors / says I don't have permission and to use sudo
Woah, stop right there. Npm should never require sudo, you've got yourself a permissions issue! 
Fix this by executing `sudo chown -R $(whoami) ~/.npm` to give npm the right permissions to your system.

### The Gulp command does not work!
If the `gulp` command is not recognised, it's probably never been installed on your machine.
Use `npm install -g gulp` and `npm install -g gulp-sass` to make these modules avaliable from the command line.

### Gulp works but gulp-sass throws an error and won't compile
This is probably because gulp-sass only supports up to node v0.10.33. See bellow:

### Do I have the right version of Node?
Gulp-sass requires node v0.10.33, check you have the right version using:
`node -v'



# Angular HTML5 mode - True or False?
Angular-route has an option to use html5 mode which removes the `#` from the url. Whilst this makes for a cleaner URL, it can cause semantic issues with routing traffic using direct urls (such as search engines) on certain servers.

In non-HTML5 mode going to `http://myapp.com` would take you to `/index.html`, going to `http://myapp.com/#/contact` would take you to `/index.html` with a query of `contact` and going to `http://myapp.com/contact` would take you to `/contact/index.html`.

With HTML5 mode turned on Angular will change `http://myapp.com/#/contact` to `http://myapp.com/contact` but it's cosmetic: Angular is still loading `/index.html` with a query of `contact`. The problem here is when the page is refreshed, or loaded using a direct URL the server will route the traffic to `/contact/index.html` and skip the Angular application all together. Lucky for us this boilerplate comes node + express set up to route traffic through our application with HTML5 mode. This comes down to a personal preference and dependant on how the site will be deployed.

### Deploying with HTML5 - False:
The default behaviour is set to with html5 mode off. Move the /public folder to a normal Apache web server. Your application will use #/ links to control views. 

### Deploying with HTML5 - True:
Easiest option: deploy using a linux server running node

1. Change the config of angular-route `html5mode: true` 

2. Start the node server by executing `node server.js` 

3. You might want to use `forever` to keep the server running, well forever. 

Harder option: 
Some people have had success re-writting the `.htaccess` file on an Apache server using PHP with custom routing headers. You'll have to look this one up though, it's in my too hard basket. 

