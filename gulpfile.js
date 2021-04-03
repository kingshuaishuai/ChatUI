const gulp = require('gulp');
const babel = require('gulp-babel');
const less = require('gulp-less');
const postcss = require('gulp-postcss');
const typescript = require('gulp-typescript').createProject('./tsconfig.json')

process.env.NODE_ENV = 'production';

const paths = {
  js: ['./src/**/*.js'],
  dest: {
    lib: 'lib',
    esm: 'es',
    dist: 'dist',
  },
};

function fullStyle(done) {
  gulp.src('./src/styles/index.less')
    .pipe(less())
    .pipe(postcss())
    .pipe(gulp.dest(paths.dest.dist));
  done()
}

// 将less文件copy到lib与esm目录下
function copyLess() {
  return gulp
    .src('src/**/**/*.less')
    .pipe(gulp.dest(paths.dest.lib))
    .pipe(gulp.dest(paths.dest.esm));
}

// 使用babel对ts, tsx进行编译，并输出到指定目录
function compileScripts(babelEnv, destDir) {
  process.env.BABEL_ENV = babelEnv;

  return gulp
    .src(['src/**/*.{ts,tsx}', '!src/**/__tests__/*.{ts,tsx}'])
    .pipe(typescript())
    .pipe(babel())
    .pipe(gulp.dest(destDir));
}

function compileCJS() {
  // 编译ts,tsx文件，将其放到lib下
  return compileScripts('cjs', paths.dest.lib);
}

function compileESM() {
  // 编译ts,tsx文件，将其放到esm下
  return compileScripts('esm', paths.dest.esm);
}

// 编译ems,cjs,复制less文件
exports.default = gulp.series([compileESM, compileCJS, copyLess]);

// 输出全量css文件至dist目录
exports.umd = gulp.series([fullStyle]);
