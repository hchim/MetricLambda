const gulp = require('gulp');
const zip = require('gulp-zip');
const run = require("gulp-run");
const babel = require('gulp-babel');

gulp.task('build', () => {
    return gulp.src(['app.js', 'lib/**/*.js', 'test/**/*.js'], {"base": "."})
        .pipe(babel({
            presets: ['env']
        }))
        .pipe(gulp.dest('build'))
});

gulp.task('packaging', function () {
    console.log('generating the deployment package.');
    return gulp.src(['build/**/*', 'node_modules/**/*', 'package.json'], {"base": "."})
        .pipe(zip('MetricLambda.zip'))
        .pipe(gulp.dest('dist'));
});

gulp.task('clean', function() {
    return run('rm -rf build dist').exec();
});

gulp.task('npm:update', function () {
    console.log('update dependencies.');
    return run('npm update').exec();
});

gulp.task('default', gulp.series('clean', 'npm:update', 'build', 'packaging'));