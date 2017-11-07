'use strict';

const gulp = require('gulp'),
      del = require('del'),
      browserSync = require('browser-sync').create(),
      sass = require('gulp-sass'),
      autoprefixer = require('gulp-autoprefixer'),
      concat = require('gulp-concat'),
      csso = require('gulp-csso'),
      rigger = require('gulp-rigger'),
      imagemin = require('gulp-imagemin'),
      uglify = require('gulp-uglify'),
      sourcemaps = require('gulp-sourcemaps');

var path = {
  dest: {
    all:'dest/',
    html: 'dest/',
    css: 'dest/css/',
    img: 'dest/img/',
    fonts: 'dest/fonts/'
  },
  src: {
    html: 'source/*.{pug,html}',
    css: 'source/css/*.sass',
    img: 'source/img/*.*',
    fonts: 'source/css/fonts/**/*.*'
  }
};

gulp.task('clean', function() {
  return del(path.dest.all)
});

gulp.task('html', function() {
  return gulp.src(path.src.html)
    .pipe(rigger())
    .pipe(gulp.dest(path.dest.html))
    .pipe(browserSync.reload({stream:true}));
});

gulp.task('css', function() {
  return gulp.src(path.src.css)
    .pipe(sourcemaps.init())
      .pipe(sass().on('error', sass.logError))
      .pipe(concat('styles.css'))
      .pipe(autoprefixer({
        browsers: [
          'last 4 versions',
          'iOS >= 8',
          'Safari >= 5'
        ],
        cascade: false
      }))
      .pipe(csso())
    .pipe(sourcemaps.write('maps'))
    .pipe(gulp.dest('dest/css'))
    .pipe(browserSync.reload({stream:true}))
});

gulp.task('img', function(done) {
  gulp.src(path.src.img)
    .pipe(imagemin())
    .pipe(gulp.dest(path.dest.img))
    .pipe(browserSync.reload({stream:true}))
    done();
});

gulp.task('build',
  gulp.series('clean',
    gulp.parallel('html', 'css', 'img')
  )
);
gulp.task('watch', function() {
  gulp.watch('./source/css/*.*', gulp.series('css'))
  gulp.watch('./source/*.html', gulp.series('html'))
  gulp.watch('./src/img/*.*', gulp.series('img'))
});
gulp.task('serve', () => {
  browserSync.init({
    server: 'dest',
    port: 8080,
    ui: {
      port: 8081,
    },
  })
  browserSync.watch('dest/**/*.*').on('change', browserSync.reload)
});

gulp.task('dev', gulp.series('build', gulp.parallel('watch', 'serve')));
