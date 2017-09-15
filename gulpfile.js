var gulp =              require('gulp'),
    sass =              require('gulp-sass'),
    browserSync =       require('browser-sync'),
    autoprefixer =      require('gulp-autoprefixer'),
    uglify =            require('gulp-uglify'),
    jshint =            require('gulp-jshint'),
    header  =           require('gulp-header'),
    rename =            require('gulp-rename'),
    cssnano =           require('gulp-cssnano'),
    imageop =           require('gulp-image-optimization'),
    sourcemaps =        require('gulp-sourcemaps'),
    postcss =           require('gulp-postcss'),
    assets  =           require('postcss-assets'),
    fs    =             require("fs"),
    path =              require('path'),
    md5 =               require('md5-file'),
    package =           require('./package.json');


function assetsCachebuster(filePath, urlPathname) {
    return fs.statSync(filePath).mtime.getTime().toString(16);
}

var banner = [
  '\n'
].join('');

gulp.task('css', function () {
    return gulp.src('src/scss/style.scss')
        .pipe(sourcemaps.init())
        .pipe(sass({errLogToConsole: true}))
        .pipe(postcss([assets({
            basePath: '../',
            loadPaths: ['app/assets/img'],
            cachebuster:  assetsCachebuster,
        })]))
        .pipe(autoprefixer('last 4 version'))
        .pipe(gulp.dest('app/assets/css/'))
        .pipe(cssnano())
        .pipe(rename({ suffix: '.min' }))
        .pipe(header(banner, { package : package }))
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest('app/assets/css/'))
        .pipe(browserSync.reload({stream:true}));
});

gulp.task('js',function(){
  gulp.src('src/js/*.js')
    .pipe(jshint('.jshintrc'))
    .pipe(jshint.reporter('default'))
    .pipe(header(banner, { package : package }))
    .pipe(gulp.dest('app/assets/js'))
    .pipe(uglify())
    .pipe(header(banner, { package : package }))
    .pipe(rename({ suffix: '.min' }))
    .pipe(gulp.dest('app/assets/js'))
    .pipe(browserSync.reload({stream:true, once: true}));
});

gulp.task('browser-sync', function() {
    browserSync.init(null, {
        server: {
            baseDir: "app"
        }
    });
});

gulp.task('bs-reload', function () {
    browserSync.reload();
});

gulp.task('images', function(cb) {
    gulp.src(['app/assets/img/**/*.png','app/assets/img/**/*.jpg','app/assets/img/**/*.gif','app/assets/img/**/*.jpeg']).pipe(imageop({
        optimizationLevel: 7,
        progressive: true,
        interlaced: true
    })).pipe(gulp.dest('app/images')).on('end', cb).on('error', cb);
});

gulp.task('build-static', function() {
    gulp.start('css', 'js');
});

gulp.task('default', ['css', 'js'], function () {
    gulp.watch("src/scss/*/*.scss", ['css']);
    gulp.watch("src/js/*.js", ['js']);
    gulp.watch("app/*.html", ['bs-reload']);
});
