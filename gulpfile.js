const path = require("path");

const { series, src, dest, parallel, watch } = require("gulp");
const webpack = require("webpack");
const del = require("del");
const autoprefixer = require("gulp-autoprefixer");
const sass = require("gulp-sass")(require("sass"));
const sourcemaps = require("gulp-sourcemaps");
const browserSync = require("browser-sync").create();
const imagemin = require("gulp-imagemin"); //Importa gulp-imagemin

const webpackConfig = require("./webpack.config.js");

const paths = {
  scripts: {
    src: "src/ts/index.ts",
    watch: "src/ts/**/*.ts",
  },
  styles: {
    src: "src/scss/main.scss",
    watch: "src/scss/**/*.scss",
  },
  img: {
    src: "src/img/**/*",
  },
  html: {
    src: "src/index.html",
  },
  dest: "dist",
  temp: ".tmp",
};

function clean() {
  return del([paths.dest, paths.temp]);
}

function server() {
  browserSync.init({
    server: {
      baseDir: "./dist",
    },
  });
}

function styles() {
  return src(paths.styles.src)
    .pipe(sourcemaps.init())
    .pipe(sass())
    .pipe(
      autoprefixer({
        cascade: false,
      })
    )
    .pipe(sourcemaps.write())
    .pipe(dest(paths.dest))
    .pipe(browserSync.stream());
}

function scripts() {
  return new Promise((resolve) =>
    webpack(webpackConfig(paths), (err, stats) => {
      if (err) console.log("Webpack", err);

      console.log(
        stats.toString({
          all: false,
          modules: true,
          maxModules: 0,
          errors: true,
          warnings: true,
          moduleTrace: true,
          errorDetails: true,
          colors: true,
          chunks: true,
        })
      );

      resolve();
    })
  );
}

function html() {
  return src(paths.html.src).pipe(browserSync.stream()).pipe(dest(paths.dest));
}

// Função para otimizar imagens
function img() {
  return src(paths.img.src)
    .pipe(imagemin([   // Adicionando o gulp-imagemin para otimizar as imagens
      imagemin.gifsicle({ interlaced: true }),
      imagemin.mozjpeg({ quality: 75, progressive: true }),
      imagemin.optipng({ optimizationLevel: 5 }),
      imagemin.svgo({
        plugins: [{ removeViewBox: true }, { cleanupIDs: false }],
      }), // Configurações do exemplo da documentação
    ]))
    .pipe(dest(paths.dest + "/img"));
}

const build = series(clean, parallel(styles, scripts, html, img));
const dev = () => {
  watch(paths.scripts.watch, { ignoreInitial: false }, scripts).on(
    "change",
    browserSync.reload
  );
  watch(paths.styles.watch, { ignoreInitial: false }, styles);
  watch(paths.img.src, { ignoreInitial: false }, img);
  watch(paths.html.src, { ignoreInitial: false }, html).on(
    "change",
    browserSync.reload
  );
  server();
};

exports.build = build;
exports.server = server;
exports.styles = styles;
exports.scripts = scripts;
exports.img = img; // Exportando a função de otimização de imagens
exports.default = dev;
