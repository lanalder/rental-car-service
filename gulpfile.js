// Gulp Variables
var gulp = require('gulp');
	sass = require('gulp-sass');
 	livereload = require('gulp-livereload');
 	connect = require('gulp-connect');
 	jshint = require('gulp-jshint');
  rename = require('gulp-rename');
  minifyCss = require('gulp-minify-css');
	webpack = require('webpack-stream');

// Server Task
function serve (done) {
    connect.server({
        root: '',
        port: 1988,
        livereload: true
    });
		done();
};

// Styles Task
function styles (done) {
    gulp.src('sass/custom.scss')
        .pipe(sass({outputStyle: 'compressed'}).on('error', sass.logError))
        .pipe(rename({suffix: '.min'}))
        .pipe(minifyCss())
        .pipe(gulp.dest('css/'))
        .pipe(connect.reload());
				done();
};

// HTML Task
function html (done) {
    gulp.src('./*.html')
    .pipe(connect.reload());
		done();
};

// JS Lint Task for correcting and monitoring your custom.js
function lint (done) {
  gulp.src('js/custom.js')
	// uhhh bundle.js has a lot of errors but idk lint it if that can b fixed
  .pipe(jshint())
	.pipe(jshint.reporter('default'))
	.pipe(connect.reload());
	done();
};

// Watch task to watch for file changes
function watch (done) {
	gulp.watch('sass/**/*.scss', gulp.series(styles));
	gulp.watch('./*.html', gulp.series(html));
	gulp.watch('js/*.js', gulp.series(lint));
	done();
};

// For all webpack work for modules and imports/require
function wp (done) {
	gulp.src('js/custom.js')
	.pipe(webpack())
	// what could possibly b the diff between dev and production? what does this do other than prevent a warning message
	.pipe(rename('bundle.js'))
	.pipe(gulp.dest('js'));
	// .pipe(browserSync.stream());
	done();
};

// function webpack () {
// 		return gulp.src('js/custom.js')
// 				.pipe(webpack())
// 				.pipe(rename('bundle.js'))
// 				.pipe(gulp.dest('js'))
// 				.pipe(browserSync.stream());
// };

// Tasks that Gulp will run
gulp.task('default', gulp.series(serve, watch, lint, html, styles, wp));
// dont 4get to add back in styles when acc do sass
