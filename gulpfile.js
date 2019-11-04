const gulp = require("gulp");
const ts = require("gulp-typescript").createProject('tsconfig.json');

//编译TS代码
gulp.task("compile", function () {
    return gulp.src('src/**/*.ts')
        .pipe(ts())
        .pipe(gulp.dest('bin'));
});