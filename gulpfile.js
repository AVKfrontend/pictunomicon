const gulp = require('gulp');
const browserSync = require('browser-sync').create();
const gulpFileInclude = require('gulp-file-include');
const scss = require('gulp-sass')(require('sass'));
const ts = require('gulp-typescript');

const src = "src/";
const dist = "dist/";

const path = {
	src: {
		html: src + 'html/*.html',
		scss: src + 'scss/index.scss',
		css: src + 'css/*.css',
		img: src + 'img/**/*.*',
		ts: src + 'ts/main.ts',
		js: src + 'js/*.js',
	},
	dist: {
		html: dist,
		css: dist + 'css/',
		img: dist + 'img/',
		js: dist + 'js/'
	},
	watch: {
		html: src + 'html/**/*.html',
		scss: src + 'scss/**/*.scss',
		css: src + 'css/**/*.css',
		img: src + 'img/**/*.*',
		ts: src + 'ts/**/*.ts',
		js: src + 'js/**/*.js',
	}
}

const webServer = () => {
	browserSync.init({
		server: {
			baseDir: dist
		},
		port: 7777,
		host: 'localhost',
		notify: false
	})
}

const htmlColl = () => {
	return gulp.src(path.src.html)
		.pipe(gulpFileInclude({
			prefix: '@@',
			basepath: 'src/html/templates/',
			index: true,
		}))
		.pipe(gulp.dest(path.dist.html))
		.pipe(browserSync.reload({stream:true}))
}

const scssCompill = () => {
	return gulp.src(path.src.scss)
		.pipe(scss().on('error', scss.logError))
		.pipe(gulp.dest(path.dist.css))
		.pipe(browserSync.reload({stream:true}));
}

const tsCompill = () => {
	return gulp.src(path.src.ts)
		.pipe(ts({
			noImplicitAny: true,
			removeComments: true,
		}))
		.pipe(gulp.dest(path.dist.js))
		.pipe(browserSync.reload({stream:true}));
}

const cssInclude = () => {
	return gulp.src(path.src.css)
		.pipe(gulp.dest(path.dist.css))
		.pipe(browserSync.reload({stream:true}));
}

const jsInclude = () => {
	return gulp.src(path.src.js)
		.pipe(gulp.dest(path.dist.js))
		.pipe(browserSync.reload({stream:true}));
}

const imgInclude = () => {
	return gulp.src(path.src.img)
		.pipe(gulp.dest(path.dist.img))
		.pipe(browserSync.reload({stream:true}));
}

const watchFiles = () => {
	gulp.watch(path.watch.html, gulp.series(htmlColl));
	gulp.watch(path.watch.scss, scssCompill);
	gulp.watch(path.watch.css, cssInclude);
	gulp.watch(path.watch.img, imgInclude);
	gulp.watch(path.watch.js, jsInclude);
	gulp.watch(path.watch.ts, tsCompill);
}

const begin = gulp.series(htmlColl, imgInclude, cssInclude, scssCompill, jsInclude);//, tsCompill

exports.default = gulp.parallel(begin, watchFiles, webServer);
