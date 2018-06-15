const gulp = require('gulp');
const zip = require('gulp-zip');
const fs = require('fs');
const rimraf = require('rimraf');
const run = require("gulp-run");

gulp.task('packaging', function () {
    console.log('generating the deployment package.');
    gulp.src(['build/**/*', 'node_modules/**/*', 'package.json'], {"base": "."})
        .pipe(zip('MetricLambda.zip'))
        .pipe(gulp.dest('dist'));
});

gulp.task('clean', function(cb) {
    console.log('clean the dist folder.');
    rimraf('build', {force: true}, cb);
});

gulp.task('npm:update', function () {
    console.log('update dependencies.');
    run('npm update').exec();
});

gulp.task('build', function () {
    console.log('build source files.');
    const ignoreFiles = [
        './README.md',
        './gulpfile.js',
        './node_modules',
        './.babelrc',
        './package.json',
        './package-lock.json',
        './dist',
        './build'
    ];

    run('babel ./ --out-dir build/ --copy-files --ignore ' + ignoreFiles.join()).exec();
});

gulp.task('default', ['clean', 'npm:update', 'build', 'packaging']);