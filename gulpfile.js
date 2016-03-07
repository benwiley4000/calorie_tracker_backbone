var gulp = require('gulp');
var plumber = require('gulp-plumber');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var jshint = require('gulp-jshint');
var rename = require('gulp-rename');
var autoprefixer = require('gulp-autoprefixer');
var minifyCSS = require('gulp-minify-css');

gulp.task('copy', [
  'copy:html',
  'copy:libs'
]);

gulp.task('copy:html', function () {
  return gulp.src('src/index.html')
    .pipe(plumber())
    .pipe(gulp.dest('public/'));
});

gulp.task('copy:libs', function () {
  return gulp.src([
    'jquery-2.1.4.min.js',
    'underscore-min.js',
    'backbone-min.js',
    'backbone.localStorage-min.js',
    'd3.min.js',
    'metricsgraphics.min.js'
  ], { cwd: 'src/js/lib/' })
    .pipe(plumber())
    .pipe(concat('libs.js'))
    .pipe(gulp.dest('public/'), { cwd: '../../../' });
});

gulp.task('buildjs', function () {
  return gulp.src([
    'app/models/*.js',
    'app/!(models)/*.js',
    'app/*.js'
  ], { cwd: 'src/js/' })
    .pipe(plumber())
    .pipe(concat('all.js'))
    .pipe(uglify())
    .pipe(rename('main.js'))
    .pipe(gulp.dest('public/'), { cwd: '../../' });
});

gulp.task('lint', function () {
  return gulp.src(['src/js/app/**/*.js', 'src/js/app/*.js'])
    .pipe(plumber())
    .pipe(jshint())
    .pipe(jshint.reporter('jshint-stylish'));
});

gulp.task('styles', function () {
  return gulp.src([
    'metricsgraphics.css',
    'app.css'
  ], { cwd: 'src/css/' })
    .pipe(plumber())
    .pipe(concat('all.css'))
    .pipe(autoprefixer({ browsers: ['> 2%'] }))
    .pipe(minifyCSS())
    .pipe(rename('main.css'))
    .pipe(gulp.dest('public/'), { cwd: '../../' });
});

gulp.task('watch', function () {
  gulp.watch('src/index.html', ['copy:html']);
  gulp.watch('src/js/app/**/*.js', ['buildjs', 'lint']);
  gulp.watch('src/css/*.css', ['styles']);
});

gulp.task('default', ['copy', 'buildjs', 'lint', 'styles', 'watch']);
