'use strict';
var gulp = require('gulp')
	,	watch = require('gulp-watch')
	,	jshint = require('gulp-jshint')
	,	jshintHTMLReporter = require('jshint-analysis-reporter')
	,	connect = require('gulp-connect')
	,	map = require('map-stream')
	,	fs = require('fs');

gulp.task('echo', function() {
  return gulp.src(['js/**/*.js'])
    .pipe(jshint())
    .pipe(jshint.reporter('default'));
});

gulp.task('log', function() {
  return gulp.src(['js/**/*.js'])
    .pipe(jshint())
    .pipe(jshint.reporter('gulp-jshint-file-reporter', {
      filename:__dirname+'/jshint-output.log'
    }));
});

gulp.task('html', function() {
  return gulp.src(['js/**/*.js'])
    .pipe(jshint())
    .pipe(jshint.reporter('gulp-jshint-html-reporter', {
      filename: __dirname + '/jshint-output.html'
    }));
});

gulp.task('json',function(){
	var errsArray = [];
	gulp.src(['js/**/*.js','!js/**/*.htm.js'])
		.pipe(jshint())
		.pipe(map(function (file, cb) {
		  if (!file.jshint.success) {
		    file.jshint.results.forEach(function (err) {
		    	// console.log(err);
		      if (err) {
		      	errsArray.push(err);
		      }
		    });
		    fs.writeFileSync('./jshint_output.json',JSON.stringify(errsArray));
		  }
		  cb(null, file);
		}));
});

gulp.task('jshint',function(){
	gulp.src(['js/**/*.js'])
	.pipe(jshint('.jshintrc'))
	.pipe(jshintHTMLReporter());
});

gulp.task('watch',function(){
	connect.server({
		port:8000,
		middleware: function(connect, opt) {
	    	return [function(req,res,next){
		      	next();
		    }]
	    }
	});
	gulp.watch(['js/**/*.js'],function(ev){
		gulp.src(ev.path)
		.pipe(jshint('.jshintrc'))
		.pipe(jshintHTMLReporter());
	})

});

gulp.task('default',['jshint','watch']);


console.log('*******************jshint test*******************');
