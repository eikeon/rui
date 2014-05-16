var gulp       = require('gulp'),
    browserify = require('gulp-browserify'),
    concat     = require('gulp-concat'),
    imagemin   = require('gulp-imagemin'),
    connect = require('connect'),
    http = require('http'),
    handler = require('./server'),
    less = require('gulp-less'),
    path = require('path');

 
gulp.task('styles', function () {
    gulp.src(['assets/css/styles.css'])
        .pipe(concat('styles.css'))
        .pipe(gulp.dest('./build/'));

});

gulp.task('scripts', function () {
    gulp.src(['assets/js/app.js'])
        .pipe(browserify({
            debug: true,
            transform: [ 'reactify' ]
        }))
        .pipe(gulp.dest('build/'));
        //.pipe(connect.reload());        
});

gulp.task('less', function () {
    gulp.src('assets/less/*.less')
        .pipe(less({
            paths: [ path.join(__dirname, 'less', 'includes') ]
        }))
        .pipe(gulp.dest('./build/css'));
});

gulp.task('images', function () {
    gulp.src(['assets/images/*.jpg'])
        .pipe(imagemin())
        .pipe(gulp.dest('build/img/'));

});

gulp.task('bootstrap', function () {
    gulp.src(['bower_components/bootstrap/dist/**'])
        .pipe(gulp.dest('./build/'));
});

gulp.task('watch', function() {
    gulp.watch('assets/js/**/*.js', [ 'scripts' ]);
    gulp.watch('assets/css/**/*.css', [ 'styles' ]);
    gulp.watch('assets/img/**/*', [ 'images' ]);
});
 
gulp.task('build', ['styles', 'less', 'scripts', 'images', 'bootstrap' ]);

gulp.task('webserver', function() {
     var app = connect()
             .use(connect.logger('dev'))
             .use(connect.static('public'))
             .use(handler);

     http.createServer(app).listen(3000);    
});

gulp.task('default', ['build', 'webserver', 'watch']);
