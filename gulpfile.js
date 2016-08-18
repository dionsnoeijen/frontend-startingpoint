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

    return gulp.src(paths.source.html + '/*.html')
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
        .pipe(source('app.js'))
        .pipe(buffer())
        .pipe(uglify())
        .pipe(gulp.dest(paths.dest.scripts))
        .pipe(livereload());
});

gulp.task('sass', function() {

    return gulp.src(paths.source.styles + '/*.scss')
        .pipe(sass({
            outputStyle: 'compressed',
            precision: 5
        }).on('error', sass.logError))
        .pipe(gulp.dest(paths.dest.styles))
        .pipe(livereload());
});

gulp.task('watch', function() {

    livereload.listen();

    gulp.watch(paths.source.html + '/*.html', ['html']);
    gulp.watch(paths.source.scripts + '/*.js', ['scripts']);
    gulp.watch(paths.source.styles + '/**/*.scss', ['sass']);
});

gulp.task('connect', function() {
    connect.server({
        root: paths.deploy,
        livereload: true
    });
});

gulp.task('test', function() {

    return gulp.src(paths.source.scripts + '/tests/*.js', {read: false})
        .pipe(mocha({reporter: 'nyan'}))
});

gulp.task('default', ['connect', 'html', 'scripts', 'sass', 'watch']);