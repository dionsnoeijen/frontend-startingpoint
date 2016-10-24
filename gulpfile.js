'use strict';

var gulp       = require('gulp'),
    babelify   = require('babelify'),
    browserify = require('browserify'),
    source     = require('vinyl-source-stream'),
    buffer     = require('vinyl-buffer'),
    cache      = require('gulp-cache'),
    imagemin   = require('gulp-imagemin'),
    size       = require('gulp-size'),
    uglify     = require('gulp-uglify'),
    concat     = require('gulp-concat'),
    sass       = require('gulp-sass'),
    connect    = require('gulp-connect'),
    gutil      = require('gulp-util'),
    mocha      = require('gulp-mocha'),
    livereload = require('gulp-livereload'),
    sourcemaps = require('gulp-sourcemaps'),
    plumber    = require('gulp-plumber'),

    paths      = require('./paths.json');

// Wee need babel core for mocha, transforms code before testing
require('babel-core/register');


gulp.task('copy', function() {
    gulp.src(['favicon.ico'], {cwd: paths.source.html}).pipe(gulp.dest('dist'));
});

gulp.task('html', function() {

    return gulp.src(paths.source.html + '/*.html')
        .pipe(gulp.dest('dist'))
        .pipe(livereload());
});

gulp.task('scripts', ['js']);

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
        .pipe(plumber())
        .pipe(source('app.js'))
        .pipe(buffer())
        .pipe(uglify())
        .pipe(sourcemaps.init({loadMaps: true}))
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest(paths.dest.scripts))
        .pipe(livereload());
});

gulp.task('sass', function() {

    return gulp.src(paths.source.styles + '/*.scss')
        .pipe(plumber())
        .pipe(sass({
            outputStyle: 'compressed',
            precision: 5
        }))
        .pipe(gulp.dest(paths.dest.styles))
        .pipe(livereload());
});

gulp.task('watch', function() {

    livereload.listen();

    gulp.watch(paths.source.html + '/*.html', ['html']);
    gulp.watch(paths.source.scripts + '/**/*.js', ['scripts']);
    gulp.watch(paths.source.styles + '/**/*.scss', ['sass']);
});

gulp.task('connect', function() {
    connect.server({
        root: paths.deploy,
        livereload: true
    });
});

gulp.task('fonts', function() {

    return gulp.src([paths.source.fonts + '/**/*'])
        .pipe(gulp.dest(paths.dest.fonts))
        .pipe(size({showFiles: true, title: 'fonts', gzip:false}));
});

gulp.task('images', function() {

    return gulp.src([paths.source.images + '/**/*'])
        .pipe(cache(imagemin({
            optimizationLevel: 3
        })))
        .pipe(gulp.dest(paths.dest.images))
        .pipe(size({showFiles: true, title: 'images', gzip:false}))
        .pipe(livereload());
});

gulp.task('test', function() {

    return gulp.src(paths.source.scripts + '/tests/*.js', {read: false})
        .pipe(mocha({reporter: 'nyan'}));
});

gulp.task('default', ['connect', 'html', 'js', 'sass', 'images', 'copy', 'fonts', 'watch']);
