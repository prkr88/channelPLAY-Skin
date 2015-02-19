var gulp = require('gulp');
var bower = require ('gulp-bower');
var sass = require ('gulp-sass');
var notify = require ('gulp-notify');
var templateCache = require ('gulp-angular-templatecache')
var browserSync = require ('browser-sync');
var modRewrite  = require('connect-modrewrite');
var middleware = require('middleware');
var streamqueue = require('streamqueue');

//Compile views into an angular $templateCache module
//Move them to a temp folder, we'll add them to public later
gulp.task('views', function(){
 return streamqueue({ objectMode: true },
    gulp.src('./build/views/**/*.html')
    )
        .pipe(templateCache('./temp/templateCache.js', { module: 'templatescache', standalone: true }))
        .pipe(gulp.dest('./build/js/'));
});

//Move files in html to public/
gulp.task('home', ['views'], function(){
	gulp.src('./build/html/*.html')
		.pipe(gulp.dest('./public/'));
});

//move everything in the assets folder to public/assets
gulp.task('assets', ['home'], function(){
	gulp.src('./build/assets/**')
		.pipe(gulp.dest('./public/src/assets/'));
});

//move both the templatecache service and angular app to public/js
gulp.task('scripts', ['assets'], function(){
	return streamqueue({ objectMode: true },
		gulp.src('./build/js/angular-app.js'),
		gulp.src('./build/js/data.js'),
		gulp.src('./build/js/temp/templateCache.js')
		)
		.pipe(gulp.dest('./public/src/js/'));
		//.pipe(del('./build/js/temp')) //DANGEROUS can delete whole app if not used correctly
});

//compile SASS and then move it to public/css
//Notify when build is complete
gulp.task('build', ['scripts'], function(){
	gulp.src('./build/scss/*scss')
		.pipe(sass({
	        style: 'compressed',
	        errLogToConsole: false,
	        onError: function(err) {
	            return notify().write(err);
	        }
	    }))
		.pipe(gulp.dest('./public/src/css/'))
		.pipe(notify("Build - Success!"));
});

//move bower components to the library folder
gulp.task('bower', function(){
	return bower()
		.pipe(gulp.dest('./public/src/js/lib/'));
});

//watch these files and run the build if they update
gulp.task('watch', function(){
    gulp.watch(
        ['./build/html/*.html',
        './build/js/*.js',
        './build/scss/**/*.scss',
        './build/scss/partials/*.scss',
        './build/views/*.html',
        './build/assets/**/*',
        './bower_components'],
        ['build']
    )
});

//Create a local web server using browser-sync
//Refresh the browser if any files change
gulp.task('serve', function () {
	var files = [
		'./public/**/*.html',
		'./public/src/**/*.js',
		'./public/src/assets/**/*',
		'./public/src/css/*.css',
		'./public/src/views*.html'
	];

    browserSync.init(files, {
        server: {
            baseDir: './public',
            middleware: [
                modRewrite([
                    '!\\.\\w+$ /index.html [L]'
                ])
            ]
        }
    });
});

//default tasks
gulp.task('default', ['build', 'bower', 'watch']);

