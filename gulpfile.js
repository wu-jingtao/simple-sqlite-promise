const gulp = require("gulp");
const ts = require("gulp-typescript").createProject('tsconfig.json');
const sourcemaps = require('gulp-sourcemaps');

//监视文件变化自动编译
gulp.task('watch', function () {
    gulp.watch(['src/**/*.ts'], ['compile']);
});

//编译TS代码
gulp.task("compile", function () {
    return gulp.src('src/**/*.ts')
        .pipe(sourcemaps.init())
        .pipe(ts())
        .pipe(sourcemaps.write())
        .pipe(gulp.dest('bin'));
});