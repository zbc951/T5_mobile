require('dotenv').config({ path: __dirname + '/.env' })

const gulp = require('gulp');
const rename = require('gulp-rename');
const replace = require('gulp-replace');
const rimraf  = require('gulp-rimraf');
const zip = require('gulp-zip');
const moment = require('dayjs');
const watch = require('gulp-watch');

const projectName = process.env.npm_package_name;

function makeid(length) {
  let result = '';
  let characters = 'abcdefghijklmnopqrstuvwxyz0123456789';
  let charactersLength = characters.length;
  for (let i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}

process.env.VERSION = moment().format('YYYYMMDD') + '-' + makeid(8);

function replaceIndex() {
  return gulp
  .src('./dist/index.build.html')
  .pipe(rimraf())
  .pipe(rename('index.html'))
  .pipe(replace(/%([a-zA-Z0-9_]+)%/g, (match) => {
    const text = process.env[ match.replace(/%/g, '') ];
    return typeof text !== 'undefined' ? text : null;
  }))
  .pipe(gulp.dest('./dist'));
}

function compress() {
  return gulp.src(
    ['./dist/**']
  )
    .pipe(zip(`${projectName}_${ moment().format('YYMMDD_HHmmss') }.zip`))
    .pipe(gulp.dest('./backup'));
}

gulp.task('default', gulp.series(replaceIndex, compress));

gulp.task('i18', function () {

  const src = './src/assets/i18n/zh-Hant.json';
  return watch(src, function () {
    return gulp.src(
      [src]
    )
      .pipe(rename('en.json'))
      .pipe(gulp.dest('./src/assets/i18n'))
      .pipe(rename('jp.json'))
      .pipe(gulp.dest('./src/assets/i18n'));
  });

});
