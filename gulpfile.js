var gulp       = require('gulp');
var pug        = require('gulp-pug')
var sass       = require('gulp-sass');
var babel      = require('gulp-babel');
var uglify     = require('gulp-uglify');
var streamify  = require('gulp-streamify');
var browserify = require('browserify');
var source     = require('vinyl-source-stream');

var locations = {
    templates: {
        in: "./src/pug/",
        out: "./dist/"
    },
    styles: {
        in: "./src/sass/",
        out: "./dist/css/"
    },
    babel: {
        in: "./src/es6/",
        out: "./src/es5/"
    },
    jscripts: {
        in: "./src/es5/",
        out: "./dist/js/"
    }
};

gulp.task('default', ['watch', 'templates', 'styles', 'jscripts', 'bundle']);

gulp.task('watch', function() {
    gulp.watch(locations.templates.in + '*.pug', ['templates']);
    gulp.watch(locations.styles.in + '*.s[ac]ss', ['styles']);
    gulp.watch(locations.babel.in + '*.js', ['jscripts']);
    gulp.watch(locations.jscripts.in + 'main.js', ['bundle']);
});

gulp.task('templates', function() {
    return gulp.src(locations.templates.in + '*.pug')
        .pipe(pug({locals: {}}))
        .pipe(gulp.dest(locations.templates.out));
});

gulp.task('styles', function() {
    return gulp.src(locations.styles.in + '*.s[ac]ss')
        .pipe(sass({outputStyle: 'compressed'}).on('error', sass.logError))
        .pipe(gulp.dest(locations.styles.out));
});

gulp.task('jscripts', function() {
    return gulp.src(locations.babel.in + '*.js')
        .pipe(babel({presets: ['es2015']}))
        .pipe(gulp.dest(locations.babel.out));
});

gulp.task('bundle', ['jscripts'], function() {
    return browserify(locations.jscripts.in + 'main')
        .bundle()
        .pipe(source('app.min.js'))
        .pipe(streamify(uglify()))
        .pipe(gulp.dest(locations.jscripts.out));
});
