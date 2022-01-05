// vue.config.js
const path = require('path');
const resolve = dir => path.join(__dirname, dir);
const CompressionWebpackPlugin = require('compression-webpack-plugin'); // 开启gzip压缩， 按需引用
const productionGzipExtensions = /\.(js|css|json|txt|html|ico|svg)(\?.*)?$/i; // 开启gzip压缩， 按需写入
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin; // 打包分析

// 非本地dev环境，测试环境及生产环境NODE_ENV均为production
const IS_PROD = process.env.NODE_ENV === 'production';
// 是否dev环境使用RAP2进行mock数据 (rap2项目地址：http://rap2.taobao.org/organization/repository/editor?id=292678)
const IS_MOCK = true;

// 仅本地dev环境开发且IS_MOCK为true才使用mock数据，否则取各环境接口域名
const targetApi1 = IS_MOCK && process.env.VUE_APP_MODE === 'dev' ? 'http://rap2api.taobao.org/app/mock/292678' : process.env.VUE_APP_API;

module.exports = {
  publicPath: IS_PROD ? process.env.VUE_APP_PUBLIC_PATH : './', // 默认'/'，部署应用包时的基本 URL
  lintOnSave: false, // 是否在开发环境下通过 eslint-loader 在每次保存时 lint 代码
  runtimeCompiler: true, // 是否使用包含运行时编译器的 Vue 构建版本
  productionSourceMap: !IS_PROD, // 生产环境的 source map
  parallel: require('os').cpus().length > 1, // 是否为 Babel 或 TypeScript 使用 thread-loader。该选项在系统的 CPU 有多于一个内核时自动启用，仅作用于生产构建。
  css: {
    extract: IS_PROD,
    sourceMap: false,
    loaderOptions: {
      scss: {
        // 向全局scss传入样式重置
        prependData: `
          @import "@scss/global.scss";
        `,
      },
    },
  },
  chainWebpack: config => {
    // 修复热更新失效
    config.resolve.symlinks(true);

    // 如果使用多页面打包，使用vue inspect --plugins查看html是否在结果数组中
    config.plugin('html').tap(args => {
      // 修复 Lazy loading routes Error
      args[0].chunksSortMode = 'none';
      return args;
    });

    // 添加别名
    config.resolve.alias
      .set('@', resolve('src'))
      .set('@assets', resolve('src/assets'))
      .set('@scss', resolve('src/assets/scss'))
      .set('@components', resolve('src/components'))
      .set('@views', resolve('src/views'))
      .set('@store', resolve('src/store'))
      .set('@utils', resolve('src/utils'));

    if (IS_PROD) {
      // 压缩图片
      config.module
        .rule('images')
        .test(/\.(png|jpe?g|gif|svg)(\?.*)?$/)
        .use('image-webpack-loader')
        .loader('image-webpack-loader')
        .options({
          mozjpeg: { progressive: true, quality: 65 },
          optipng: { enabled: false },
          pngquant: { quality: [0.65, 0.9], speed: 4 },
          gifsicle: { interlaced: false },
        });

      // 打包分析
      config.plugin('webpack-report').use(BundleAnalyzerPlugin, [
        {
          analyzerMode: 'static',
        },
      ]);
    }
  },
  configureWebpack: config => {
    // 开启 gzip 压缩
    const plugins = [];
    if (IS_PROD) {
      plugins.push(
        new CompressionWebpackPlugin({
          filename: '[path].gz[query]',
          algorithm: 'gzip',
          test: productionGzipExtensions,
          threshold: 10240,
          minRatio: 0.8,
        }),
      );
    } else {
      // chrome 显示源码方便dubug
      config.devtool = 'eval-source-map';
    }
    config.plugins = [...config.plugins, ...plugins];
  },

  devServer: {
    overlay: {
      // 让浏览器 overlay 同时显示警告和错误
      warnings: true,
      errors: true,
    },
    port: 8888, // 端口号
    https: false, // https:{type:Boolean}
    open: true, // 配置自动启动浏览器
    hotOnly: true, // 热更新
    proxy: {
      '/api1': {
        target: targetApi1,
        changeOrigin: true,
        pathRewrite: {
          '/api1': '',
        },
      },
      // '/api2': {
      //   target: targetApi2,
      //   changeOrigin: true,
      //   pathRewrite: {
      //     '/api2': '',
      //   },
      // },
    },
  },
};
