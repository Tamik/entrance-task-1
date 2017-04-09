var gulp = require('gulp'),
	bs = require('browser-sync').create(),
	sass = require('gulp-sass'),
	autoprefixer = require('gulp-autoprefixer');

gulp.task('html', function() {
	gulp.src('./source/**/*.html')
		.pipe(gulp.dest('./public'));
});

gulp.task('html-watch', ['html'], function(done) {
	bs.reload();
	done();
});

gulp.task('js', function() {
	gulp.src('./source/js/**/*.js')
		.pipe(gulp.dest('./public/js'));
});

gulp.task('js-watch', ['js'], function(done) {
	bs.reload();
	done();
});

gulp.task('sass', function() {
	gulp.src('./source/styles/**/*.scss')
		.pipe(sass())
		.pipe(autoprefixer())
		.pipe(gulp.dest('./public/styles'));
});

gulp.task('sass-watch', ['sass'], function(done) {
	bs.reload();
	done();
});

gulp.task('images', function() {
	gulp.src('./source/images/**/*')
		.pipe(gulp.dest('./public/images'));
});

gulp.task('images-watch', ['images'], function(done) {
	bs.reload();
	done();
});

gulp.task('serve', ['html', 'sass', 'js', 'images'], function() {
	bs.init({
		server: {
			baseDir: './public'
		},
		notify: false
	});

	gulp.watch('./source/**/*.html', ['html-watch']);
	gulp.watch('./source/**/*.scss', ['sass-watch']);
	gulp.watch('./source/js/**/*.js', ['js-watch']);
	gulp.watch('./source/images/**/*', ['images-watch']);
});

gulp.task('default', ['serve']);
