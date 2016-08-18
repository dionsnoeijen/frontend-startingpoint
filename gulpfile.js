'use strict';

var gulp = require('gulp'),
    babelify = require('babelify'),
    browserify = require('browserify'),
    source = require('vinyl-source-stream'),
    buffer = require('vinyl-buffer'),
    uglify = require('gulp-uglify'),
    concat = require('gulp-concat'),
    sass = require('gulp-sass'),
    connect = require('gulp-connect'),
    gutil = require('gulp-util'),
    mocha = require('gulp-mocha'),
    livereload = require('gulp-livereload'),

    paths = require('./paths.json');

gulp.task('html', function() {

    return gulp.src('src/*.html')
        .pipe(gulp.dest('dist'))
        .pipe(livereload());
});

gulp.task('scripts', ['js', 'test']);

gulp.task('js', function() {

    return browserify({
        entries: [paths.source.scripts + '/app.js'],
        paths: ['./node_modules', paths.source.scripts],
        debug: true
    })
        .transform(babelify, {presets: ["es2015"]})
        .bundle()
        .on('error', function(e) {
            gutil.log(e);
        })
        .pipe(source( 'app.js' ))
        .pipe(buffer())
        .pipe(uglify())
        .pipe(gulp.dest('dist/js'))
        .pipe(livereload());
});

gulp.task('sass', function() {

    return gulp.src('src/scss/*.scss')
        .pipe(sass().on('error', sass.logError))
        .pipe(gulp.dest('dist/css'))
        .pipe(livereload());
});

gulp.task('watch', function() {

    livereload.listen();

    gulp.watch('src/*.html', ['html']);
    gulp.watch('src/js/*.js', ['scripts']);
    gulp.watch('src/scss/**/*.scss', ['sass']);
});

gulp.task('connect', function() {
    connect.server({
        root: 'dist',
        livereload: true
    });
});

gulp.task('test', function() {

    return gulp.src('src/js/tests/*.js', {read: false})
        .pipe(mocha({reporter: 'nyan'}))
});

gulp.task('default', ['connect', 'html', 'scripts', 'sass', 'watch']);