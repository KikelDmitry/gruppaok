'use strict';

//PCKGS
const { src, dest, parallel, series, watch } = require('gulp');

//common
const browserSync = require('browser-sync');
const concat = require('gulp-concat');
const sourcemaps = require('gulp-sourcemaps');
const del = require('del');

//html
const gulpPug = require('gulp-pug');

// css
const gulpSass = require('gulp-sass');
const postcss = require('gulp-postcss');
const autoprefixer = require('autoprefixer');
const csso = require('postcss-csso');

//js
const minify = require('gulp-minify');

//bitmap
const imagemin = require('gulp-imagemin');

//svg
const gulpSvgSprite = require('gulp-svg-sprite');
const cheerio = require('gulp-cheerio');
const svgmin = require('gulp-svgmin');


//CONFIG

const config = {
	src: './src/',
	dest: './build/',
};
const globs = {
	pug: [
		config.src + 'pug/**/*.pug',
		'!' + config.src + 'pug/**/_*/*.pug',
	],
	scss: config.src + 'scss/main.scss',
	js: [
		'node_modules/@glidejs/glide/dist/glide.min.js',
		config.src + 'js/**/*.js',
	],
	images: [
		config.src + 'img/**/*.{png,jpg,jpeg,svg,gif,webp}',
		'!' + config.src + 'img/sprite/**/*.svg'
	],
	sprite: config.src + 'img/sprite/**/*.svg',
	fonts: config.src + 'fonts/**/*.*',
}

//server
const server = () => {
	browserSync.init({
		server: {
			baseDir: config.dest
		}
	})
};

//TASKS
const pug = () => {
	return src(globs.pug)
		.pipe(gulpPug({
			pretty: false,
			basedir: './'
		}))
		.pipe(dest(config.dest))
		.pipe(browserSync.stream())
};
exports.pug = pug;

const scss = () => {
	return src(globs.scss)
		.pipe(sourcemaps.init())
		.pipe(gulpSass({
			outputStyle: 'expanded'
		}))
		.on('error', gulpSass.logError)
		.pipe(postcss([
			autoprefixer(),
			csso()
		]))
		.pipe(sourcemaps.write('.'))
		.pipe(dest(config.dest + 'css'))
		.pipe(browserSync.stream())

};

const criticalCss = () => {
	return src(globs.criticalScss)
		.pipe(gulpSass({

		}))
		.pipe(postcss([
			autoprefixer(),
			csso(),
		]))
		.pipe(dest(config.dest + 'css'))
		.pipe(browserSync.stream())
};

const scripts = () => {
	return src(globs.js)
		.pipe(concat('bundle.js'))
		.pipe(minify({
			ext: {
				min: '.min.js'
			}
		}))
		.pipe(dest(config.dest + 'js'))
		.pipe(browserSync.stream())
};

const images = () => {
	return src(globs.images)
		.pipe(imagemin({
			plugins: [
				imagemin.gifsicle({ interlaced: true }),
				imagemin.mozjpeg({ quality: 75, progressive: true }),
				imagemin.optipng({ optimizationLevel: 5 }),
				imagemin.svgo({
					plugins: [
						{ removeViewBox: true },
						{ cleanupIDs: false }
					]
				}),
			],
			verbose: true
		}))
		.pipe(dest(config.dest + 'img'))
};
exports.images = images;


const svgsprite = () => {
	return src(globs.sprite)
		.pipe(svgmin({
			js2svg: {
				pretty: true
			}
		}))
		.pipe(cheerio({
			run: function ($) {
				$('[fill]').removeAttr('fill');
				$('[stroke]').removeAttr('stroke');
				$('[style]').removeAttr('style');
			},
			parserOptions: { xmlMode: true }
		}))
		.pipe(gulpSvgSprite({
			mode: {
				symbol: {
					sprite: '../sprite.svg'  //sprite file name
				}
			},
		}
		))
		.pipe(dest(config.dest + 'img'));
};
exports.svgsprite = svgsprite;

const fonts = () => {
	return src(globs.fonts)
		.pipe(dest(config.dest + 'fonts'))
};

const watcher = () => {
	watch(config.src + 'pug/**/*.pug', pug)
	watch(config.src + 'scss/**/*.scss', scss)
	// watch(config.src + 'scss/**/critical.scss', series(criticalCss, pug))
	watch(globs.js, scripts)
	watch(globs.images, images)
	watch(globs.sprite, svgsprite)
};


const clean = () => {
	return del(config.dest + '**', { force: true })
};
exports.clean = clean;


//build task
exports.build = series(
	clean,
	parallel(
		series(
			scss,
			// criticalCss,
			pug,
		),
		scripts,
		// svgsprite,
		images,
		fonts
	)
);

//development task
exports.dev = series(
	this.build,
	parallel(
		server,
		watcher
	)
);
