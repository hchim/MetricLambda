const gulp = require('gulp');
const zip = require('gulp-zip');
const run = require("gulp-run");
const babel = require('gulp-babel');
const prompt = require('gulp-prompt');

gulp.task('build', () => {
    return gulp.src(['app.js'], {"base": "."})
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

gulp.task('npm:update', function() {
    console.log('update dependencies.');
    return run('npm update').exec();
});

gulp.task('test', function() {
    return gulp.src('test/event.json')
        .pipe(prompt.prompt([{
            type: 'input',
            name: 'password',
            message: 'MongoDB Password:'
        }], (res) => {
            const uri = "mongodb+srv://lambda-user:" + res.password + "@cluster0-kncol.mongodb.net/test?retryWrites=true";
            let command = "lambda-local -l build/app.js -e test/event.json -E {\\\"MONGODB_ATLAS_CLUSTER_URI\\\":\\\""
                + uri + "\\\"\\\,\\\"MONGODB_NAME\\\":\\\"CloudAPIs\\\"}";
            return run(command).exec();
        }));
});

gulp.task('default', gulp.series('clean', 'npm:update', 'build', 'packaging'));