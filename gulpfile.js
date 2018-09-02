'use strict';

const gulp        = require('gulp');
const del         = require('del');
const util        = require('gulp-util');
const sass        = require('gulp-sass');
const prefixer    = require('gulp-autoprefixer');
const uglify      = require('gulp-uglify');
const concat      = require('gulp-concat');
const rename      = require('gulp-rename');
const replace     = require('gulp-replace');
const handlebars  = require('gulp-compile-handlebars');
const browserSync = require('browser-sync');
// const ghPages     = require('gulp-gh-pages');
const sassGlob    = require('gulp-sass-bulk-import');
const watch       = require('gulp-watch');
const babel       = require('gulp-babel');
const scsslint    = require('gulp-scss-lint');
// const eslint      = require('gulp-eslint');
const cleanCSS    = require('gulp-clean-css');
const htmlmin     = require('gulp-htmlmin');
const purify      = require('gulp-purifycss');
const tar         = require('gulp-tar');
const gzip        = require('gulp-gzip');

var paths = {
  src: { root: 'src' },
  images: { root: 'images'},
  raw: { root: 'raw/**/*' },
  dist: { root: 'dist' },
  init: function() {
    this.src.sass        = this.src.root + '/scss/main.scss';
    this.src.templates   = this.src.root + '/**/*.hbs';
    this.src.fulljavascript = [this.src.root + '/js/libs/*.js', this.src.root + '/js/**/*.js'];
    this.src.javascript  = [this.src.root + '/js/**/*.js', '!' + this.src.root + '/js/libs/*.js'];
    this.src.libs        = this.src.root + '/js/libs/*.js';
    this.src.images      = this.images.root + '/**/*.{jpg,jpeg,svg,png,gif,ico}';
    this.src.files       = this.src.root + '/*.{html,txt}';

    this.dist.css        = this.dist.root + '/css';
    this.dist.images     = this.dist.root + '/images';
    this.dist.javascript = this.dist.root + '/js';
    this.dist.libs       = this.dist.root + '/js/libs';
    this.dist.tar        = this.dist.root + '/dist.tar';

    return this;
  },
}.init();

gulp.task('serve', () => {
  return browserSync.init({
    server: paths.dist.root,
    open: false,
    notify: false,

    // Whether to listen on external
    online: false,
  });
});

gulp.task('default-sources', (done) => {

  gulp.src('./src/partials/head.hbs', { base: './src/partials/' })
  .pipe(replace(/<link id=\"main-style\".*>/g, '<link id="main-style" rel="stylesheet" href="css/main.css">'))
  .on('error', util.log)
  .pipe(gulp.dest('./src/partials/'));

  gulp.src('./src/partials/bottom.hbs', { base: './src/partials/' })
  .pipe(replace(/<script id=\"bundle\".*><\/script>/g, '<script id="bundle" src="./js/bundle.js"></script>'))
  .on('error', util.log)
  .pipe(gulp.dest('./src/partials/'));

  done();
});

/*
* Development Styles
*/
gulp.task('styles', () => {
  return gulp.src([paths.src.sass])
  .pipe(sassGlob())
  .on('error', util.log)
  .pipe(sass({
    includePaths: ['src/scss']
  }))
  .on('error', util.log)
  .pipe(prefixer('last 2 versions'))
  .on('error', util.log)
  .pipe(gulp.dest(paths.dist.css))
  .pipe(browserSync.reload({stream: true}));
});


/*
* Production Styles
*/
gulp.task('styles-prod',  () => {
  var filename = 'main-' + (+new Date).toString(36) + '.css';

  gulp.src('./src/partials/head.hbs', { base: './src/partials/' })
  .pipe(replace(/<link id=\"main-style\".*>/g, '<link id="main-style" rel="stylesheet" href="css/'+ filename +'">'))
  .on('error', util.log)
  .pipe(gulp.dest('./src/partials/'));

  gulp.src([paths.src.sass])
  .pipe(sassGlob())
  .pipe(sass({
    includePaths: ['src/scss'],
    outputStyle: 'compressed'
  }).on('error', sass.logError))
  .pipe(rename(filename))
  .pipe(prefixer('last 2 versions'))
  .pipe(cleanCSS({compatibility: 'ie8'}))
  .pipe(gulp.dest(paths.dist.css))
  .pipe(browserSync.reload({stream: true}));

  // .pipe(purify(['./dist/js/*.js', './dist/*.html']))
});

/*
* SCSS Linter
*/
gulp.task('scss-lint', function() {
  return gulp.src('/src/scss/*.scss')
  .pipe(scsslint());
});

/*
* Compile handlebars/partials into html
*/
gulp.task('templates', (done) => {
  var opts = {
    ignorePartials: true,
    batch: ['src/partials'],
  };

  gulp.src([paths.src.root + '/pages/*.hbs'])
  .pipe(handlebars(null, opts))
  .on('error', util.log)
  .pipe(rename({
    extname: '.html',
  }))
  .on('error', util.log)
  .pipe(gulp.dest(paths.dist.root))
  .pipe(browserSync.reload({stream: true}));

  done();
});

/*
* Development bundle all javascript files
*/
gulp.task('scripts', () => {
  return gulp.src(paths.src.fulljavascript)
  .pipe(concat('bundle.js'))
  .pipe(gulp.dest(paths.dist.javascript))
  .pipe(browserSync.reload({stream: true}));
  // .pipe(babel({ presets: ['es2015'] }))
});

/*
* Prod bundle all javascript files
*/
gulp.task('scripts-prod', () => {
  var filename = 'bundle-' + (+new Date).toString(36) + '.js';

  gulp.src('./src/partials/bottom.hbs', { base: './src/partials/' })
  .pipe(replace(/<script id=\"bundle\".*><\/script>/g, '<script id="bundle" src="./js/' + filename + '"></script>'))
  .on('error', util.log)
  .pipe(gulp.dest('./src/partials/'));

  gulp.src(paths.src.fulljavascript)
  //.pipe(babel({ presets: ['es2015'] }))
  .pipe(concat(filename))
  .pipe(uglify())
  .pipe(gulp.dest(paths.dist.javascript))
  .pipe(browserSync.reload({stream: true}));
});

/*
* Linter
*/
// gulp.task('lint', function() {
//   return gulp.src('lib/**').pipe(eslint({
//     'rules':{
//       'quotes': [1, 'single'],
//       'semi': [1, 'always']
//     }
//   }))
//   .pipe(eslint.format())
//   // Brick on failure to be super strict
//   .pipe(eslint.failOnError());
// });

gulp.task('images', () => {
  return gulp.src([paths.src.images])
  .pipe(gulp.dest(paths.dist.images));
});

gulp.task('files', () => {
  return gulp.src([paths.src.files])
  .pipe(gulp.dest(paths.dist.root));
});

gulp.task('raw', () => {
  return gulp.src([paths.raw.root])
  .pipe(gulp.dest(paths.dist.root));
});


gulp.task('cleanup', (done) => {
  del([paths.dist.css + '/*']);
  del([paths.dist.javascript + '/*']);
  del([paths.dist.tar]);
  done();
});


gulp.task('watch', (done) => {
  gulp.watch('src/scss/**/*.scss', gulp.series('styles'));
  gulp.watch(paths.src.javascript, gulp.series('scripts'));
  // gulp.watch('src/scss/**/*.scss', ['styles-prod']);
  // gulp.watch(paths.src.javascript, ['scripts-prod']);
  gulp.watch(paths.src.templates, gulp.series('templates'));
  gulp.watch(paths.src.images, gulp.series('images'));
  gulp.watch(paths.src.files, gulp.series('files'));
  done();
});

var now = new Date();
gulp.task('tar', () =>
    gulp.src('dist/**/*')
        .pipe(tar('dist-' + now.getFullYear() + '-' + (now.getMonth() + 1) + '-' + now.getDate() +'.tar'))
        .pipe(gzip())
        .pipe(gulp.dest('./'))
);

// gulp.task('deploy', () => {
//   return gulp.src([paths.dist.root + '/**/*'])
//   .pipe(ghPages());
// });

// gulp.task('default', ['cleanup', 'default-sources', 'images', 'raw', 'files', 'templates', 'styles', 'scripts',  'watch', 'serve'], function() {
//   console.log('Dev build completed');
// });
gulp.task('default',
  gulp.series('cleanup', 'default-sources', 'images', 'raw', 'files', 'templates', 'styles', 'scripts',  'watch', 'serve', function(done) {
      console.log('Dev build completed');
      done();
    })
);


gulp.task('prod', 
  gulp.series('cleanup', 'images', 'raw', 'files', 'templates', 'styles-prod', 'scripts-prod', 'watch', 'serve'),
  function() {
    console.log('Prod build completed');
});
