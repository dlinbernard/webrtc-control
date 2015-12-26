var gulp = require('gulp');
var zip = require('gulp-zip');
var gulpif = require('gulp-if');
var wait = require('gulp-wait');
var shell = require('gulp-shell');
var clean = require('gulp-clean');
var change = require('gulp-change');
var gulpFilter = require('gulp-filter');
var runSequence = require('run-sequence');

/* ------------------------------ */
/* ------------ Clean ----------- */
/* ------------------------------ */

gulp.task('clean', function () {
  return gulp.src(['builds/unpacked/chrome/*', 'builds/unpacked/firefox/*'], {read: false}).pipe(clean());
});

/* ------------------------------ */
/* -------- Chrome Build -------- */
/* ------------------------------ */

gulp.task('chrome-build', function () {
  gulp.src(['src/**/*']).pipe(gulpFilter(function (f) {
    if (f.relative.indexOf('firefox') !== -1) return false;
    if (f.relative.indexOf('package.json') !== -1) return false;
    if (f.relative.indexOf('.DS_Store') !== -1 || f.relative.indexOf('Thumbs.db') !== -1) return false;
    return true;
  }))
  .pipe(gulpif(function (f) {return f.path.indexOf('.js') !== -1 && f.path.indexOf('.json') === -1}, change(function (content) {
    return content.replace(/\/\*\*[\s\S]*\\*\*\*\/(\r\n)*/m, '');
  })))
  .pipe(gulpif(function (f) {return f.path.indexOf('.html') !== -1}, change(function (content) {
    return content.replace(/.*popup\.js.*/, '    <script src="chrome/chrome.js"></script>\n    <script src="popup.js"></script>').replace(/.*options\.js.*/, '    <script src="chrome/chrome.js"></script>\n    <script src="options.js"></script>');
  })))
  .pipe(gulp.dest('builds/unpacked/chrome')).pipe(zip('chrome.zip')).pipe(gulp.dest('builds/packed'));
});
gulp.task('chrome-install', function () {
  gulp.src('')
  .pipe(wait(1000))
  .pipe(shell([
    '"C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe" --load-and-launch-app="<%= file.path %>\\builds\\unpacked\\chrome"'
  ], {cwd: './builds/unpacked/chrome'}));
});

/* ------------------------------ */
/* ------- FireFox Build -------- */
/* ------------------------------ */

gulp.task('firefox-build', function () {
  gulp.src(['src/**/*']).pipe(gulpFilter(function (f) {
    if (f.relative.indexOf('manifest.json') !== -1) return false;
    if (f.relative.indexOf('.DS_Store') !== -1 || f.relative.indexOf('Thumbs.db') !== -1) return false;
    if (f.relative.indexOf('chrome') !== -1 && f.relative !== 'chrome.manifest' && f.relative.indexOf('firefox/chrome') === -1) return false;
    return true;
  }))
  .pipe(gulpif(function (f) {return f.path.indexOf('.html') !== -1}, change(function (content) {
    return content.replace(/(\r\n)*.*options\.js.*/, '').replace(/(\r\n)*.*popup\.js.*/, '');
  }))).pipe(gulp.dest('builds/unpacked/firefox'));
});

/* ------------------------------ */
/* -------- FireFox Pack -------- */
/* ------------------------------ */

gulp.task('firefox-pack', function () {
  gulp.src('').pipe(wait(1000)).pipe(shell(['jpm xpi', 'mv *.xpi ../../packed/firefox.xpi', 'jpm post --post-url http://localhost:8888/'], {cwd: './builds/unpacked/firefox'}));
});

/* ------------------------------ */
/* ------------ RUN ------------- */
/* ------------------------------ */

gulp.task('chrome', function (callback) {
  runSequence('clean', 'chrome-build', 'chrome-install', callback);
});

gulp.task('firefox', function (callback) {
  runSequence('clean', 'firefox-build', 'firefox-pack', callback);
});