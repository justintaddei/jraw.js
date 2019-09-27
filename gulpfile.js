const gulp = require('gulp')
const ts = require('gulp-typescript')
const merge = require('merge2')
const rollup = require('gulp-rollup')
const tsProject = ts.createProject('tsconfig.json')
const rename = require('gulp-rename')
const tsProjectES5 = ts.createProject('tsconfig.json', {
  module: 'commonjs',
  target: 'es5'
})
const tsProjectTmp = ts.createProject('tsconfig.json', {
  target: 'es5'
})

const esnext = () => {
  const tsResult = gulp
    .src('./src/**/*.ts') // or tsProject.src()
    .pipe(tsProject())

  return merge([
    tsResult.dts.pipe(gulp.dest('releases/esnext/definitions')),
    tsResult.js.pipe(gulp.dest('releases/esnext/js'))
  ])
}

const cjs = () => {
  const tsResult = gulp
    .src('./src/**/*.ts') // or tsProject.src()
    .pipe(tsProjectES5())

  return merge([
    tsResult.dts.pipe(gulp.dest('releases/cjs/definitions')),
    tsResult.js.pipe(gulp.dest('releases/cjs/js'))
  ])
}

const tmp = () => {
  const tsResult = gulp
    .src('./src/**/*.ts') // or tsProject.src()
    .pipe(tsProjectTmp())

  return tsResult.js.pipe(gulp.dest('tmp/'))
}

const iife = () => {
  return (
    gulp
      .src('./tmp/**/*.js')
      // transform the files here.
      .pipe(
        rollup({
          // any option supported by Rollup can be set here.
          input: './tmp/index.js',
          output: {
            format: 'iife',
            name: 'Jraw'
          }
        })
      )
      .pipe(rename('jraw.js'))
      .pipe(gulp.dest('./releases/iife/'))
  )
}

exports.default = gulp.series(esnext, tmp, cjs, iife)
