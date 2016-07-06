var gulp = require('gulp');
var less = require('gulp-less');
var uglify = require('gulp-uglify');
var imagemin = require('gulp-imagemin');
var connect = require('gulp-connect');
var cleanCSS = require('gulp-clean-css');
var postcss = require('gulp-postcss');
var pxtorem = require('postcss-pxtorem');
var autoprefixer = require('autoprefixer');
var critical = require('critical').stream;
var jshint = require('gulp-jshint');
var concat = require('gulp-concat');

var destination = 'dist';

var processors = [
  pxtorem({
      replace: false,
      propWhiteList: []
  }),
  autoprefixer()
];

//IMAGES
gulp.task('img:prod', function() {
  return gulp.src('img/**/*')
    .pipe(imagemin({
      progressive: true
    }))
    .pipe(gulp.dest(destination + '/img'));
});

gulp.task('img:dev', function() {
  return gulp.src('img/**/*')
    .pipe(gulp.dest(destination + '/img'));
});

// JAVASCRIPT
gulp.task('js:prod', function() {
  return gulp.src('js/**/*.js')
    .pipe(uglify())
    .pipe(concat('scripts.js'))
    .pipe(gulp.dest(destination + '/js'));
});

gulp.task('js:dev', function() {
  return gulp.src('js/**/*.js')
    .pipe(jshint())
    .pipe(jshint.reporter())
    .pipe(concat('scripts.js'))
    .pipe(gulp.dest(destination + '/js'))
    .pipe(connect.reload());
});

// LESS
gulp.task('less:prod', function() {
  return gulp.src('less/style.less')
    .pipe(less())
    .pipe(postcss(processors))
    .pipe(cleanCSS())
    .pipe(gulp.dest(destination + '/css'));
});

gulp.task('less:dev', function() {
  return gulp.src('less/style.less')
    .pipe(less())
    .pipe(postcss(processors))
    .pipe(gulp.dest(destination + '/css'))
    .pipe(connect.reload());
});

// CRITICAL CSS
gulp.task('critical:prod', ['less:prod'], function() {
  return gulp.src('index-source.html')
    .pipe(critical({
      inline: true,
      minify: true,
      dest: 'index.html',
      height: 1080,
      width: 1920
    }));
});

gulp.task('critical:dev', ['less:dev'], function() {
  return gulp.src('index-source.html')
    .pipe(clone())
    .pipe(rename('index.html'))
    .pipe(gulp.dest('.'));
});

// WATCH & CONNECT
gulp.task('watch', function() {
  gulp.watch(['./less/**/*.less'], ['less:dev']);
  gulp.watch(['./js/**/*.js'], ['js:dev']);
});

gulp.task('connect', function() {
  connect.server({
    livereload: true,
    fallback: 'index-source.html'
  });
});

// GLOBAL STRUCTURE
gulp.task('build:prod', ['critical:prod', 'js:prod', 'img:prod']);
gulp.task('build:dev', ['less:dev', 'js:dev', 'img:dev']);

gulp.task('prod', ['build:prod']);
gulp.task('dev', ['build:dev','connect','watch']);
gulp.task('default', ['dev']);