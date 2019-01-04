const gulp = require('gulp')
const sass = require('gulp-sass')
const postcss = require('gulp-postcss')
const splitCss = require('postcss-split-css')
const del = require('del')

gulp.task('clean', () => {
    return del(['./dist'])
})

gulp.task('sass', gulp.series('clean', () => {
    return gulp
        .src('./src/sass/*.scss')
        .pipe(
            sass({
                outputStyle: "compact",
            }).on('error', sass.logError)
        )
        .pipe(
            postcss([
                splitCss({
                    filter: ['.lte_ie9', '.ie9', '.ie8'],
                    output: {
                        from: __dirname + '/src/sass',
                        dist: __dirname + "/dist/css",
                        subfix: ".ie",
                        append: "#__generated__{content:'" + new Date().toISOString() + "'}"
                    }
                })
            ])
        )
        .pipe(gulp.dest('./dist/css'))
}))

gulp.task('default', gulp.series('sass'))