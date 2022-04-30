const { series, parallel, src, dest, watch } = require('gulp');
const postcss = require('gulp-postcss');
const uglify = require('gulp-uglify');

function buildCss() {
  return src('./src/assets/css/*.css')
    .pipe(postcss())
    .pipe(dest('./public/css'));
}

function buildJs() {
  return src('./src/assets/js/*.js')
    .pipe(uglify())
    .pipe(dest('./public/js'));
}

function watcher() {
  watch('./src/assets/css/*.css', buildCss);
  watch('./src/views/*.pug', buildCss);
  watch('./src/assets/js/*.js', buildJs);
}

exports.default = parallel(buildCss, buildJs);
exports.watch = watcher;

