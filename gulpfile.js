var gulp = require('gulp');
var plumber = require('gulp-plumber');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var jshint = require('gulp-jshint');
var rename = require('gulp-rename');
var minifyCSS = require('gulp-minify-css');

gulp.task('buildjs', function () {
  return gulp.src([
    'lib/jquery-2.1.4.min.js',
    'lib/underscore-min.js',
    'lib/backbone-min.js',
    'lib/backbone.localStorage-min.js',
    'app/models/*.js',
    'app/!(models)/*.js',
    'app/app.js'
  ], { cwd: 'src/js/' })
    .pipe(plumber())
    .pipe(concat('all.js'))
    .pipe(uglify())
    .pipe(rename('main.js'))
    .pipe(gulp.dest('public/'), { cwd: '../../' });
});

gulp.task('lint', function () {
  return gulp.src('js/*.js')
    .pipe(plumber())
    .pipe(jshint())
    .pipe(jshint.reporter('jshint-stylish'));
});

gulp.task('styles', function () {
  return gulp.src('src/css/*.css')
    .pipe(plumber())
    .pipe(concat('all.css'))
    .pipe(minifyCSS())
    .pipe(rename('main.css'))
    .pipe(gulp.dest('public/'));
});

gulp.task('watch', function () {
  gulp.watch(['src/js/**/*.js', 'src/js/*.js'], ['buildjs', 'lint']);
  gulp.watch('src/css/*.css', ['styles']);
});

gulp.task('default', ['buildjs', 'lint', 'styles', 'watch']);