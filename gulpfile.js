var gulp         = require('gulp'), // Подключаем Gulp
    sass         = require('gulp-sass'), //Подключаем Sass пакет,
    concat       = require('gulp-concat'), // Подключаем gulp-concat (для конкатенации файлов)
    uglify       = require('gulp-uglifyjs'), // Подключаем gulp-uglifyjs (для сжатия JS)
    cssnano      = require('gulp-cssnano'), // Подключаем пакет для минификации CSS
    rename       = require('gulp-rename'), // Подключаем библиотеку для переименования файлов
    del          = require('del'), // Подключаем библиотеку для удаления файлов и папок
    imagemin     = require('gulp-imagemin'), // Подключаем библиотеку для работы с изображениями
    pngquant     = require('imagemin-pngquant'), // Подключаем библиотеку для работы с png
    jpegoptim    = require('imagemin-jpegoptim'), // Подключаем библиотеку для работы с jpg
    jpegtran     = require('imagemin-jpegtran'), // Подключаем библиотеку для работы с jpg
    cache        = require('gulp-cache'), // Подключаем библиотеку кеширования
    autoprefixer = require('gulp-autoprefixer'),// Подключаем библиотеку для автоматического добавления префиксов
    bourbon      = require('node-bourbon'),
    sourcemaps   = require('gulp-sourcemaps');


var themePath = 'talen';

gulp.task('scripts', function() {
    return gulp.src([ // Берем все необходимые библиотеки
        themePath + '/inc/js/template.js'
    ])
        .pipe(concat('template.min.js')) // Собираем их в кучу в новом файле template.min.js
        .pipe(uglify()) // Сжимаем JS файл
        .pipe(gulp.dest(themePath + '/inc/js')); // Выгружаем в папку inc/js
});

gulp.task('clean', function() {
    return del.sync(themePath + '/inc/css'); // Удаляем папку css перед сборкой
});

gulp.task('css-libs',['clean'], function () {
    return gulp.src([
        themePath + '/inc/sass/style.scss'
    ])
        .pipe(sourcemaps.init())
        .pipe(sass({includePaths:bourbon.includePaths}).on('error', sass.logError)) // Преобразуем Sass в CSS посредством gulp-sass
        .pipe(autoprefixer(['last 15 versions', '> 1%', 'ie 8', 'ie 7'], { cascade: true })) // Создаем префиксы
        .pipe(cssnano())
        .pipe(rename({suffix: '.min'}))
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest(themePath + '/inc/css')) // Выгружаем в папку app/css
})


gulp.task('img', function() {
    return gulp.src(themePath + '/inc/img/**/*') // Берем все изображения из img
        .pipe(cache(imagemin({  // Сжимаем их с наилучшими настройками с учетом кеширования
            interlaced: true,
            progressive: true,
            svgoPlugins: [{removeViewBox: false}],
            use: [pngquant(),jpegtran()]
        })))
        .pipe(gulp.dest(themePath + '/inc/img')); // Выгружаем на продакшен
});

gulp.task('clear', function () {
    return cache.clearAll();
})

gulp.task('watch', ['css-libs','scripts'], function() {
    gulp.watch(themePath + '/inc/sass/**/*.scss', ['css-libs']); // Наблюдение за sass файлами в папке sass
    gulp.watch(themePath + '/inc/js/*.js', ['scripts']);   // Наблюдение за JS файлами в папке js
});

gulp.task('build',['css-libs', 'scripts'])


gulp.task('default', ['watch']);