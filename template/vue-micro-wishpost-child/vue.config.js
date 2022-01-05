const webpack = require("webpack");
const APP_NAME = require("./package.json").name;
const PARENT_Name = require("./package.json").parentName;
const PORT = require("./package.json").devPort;
const NODE_ENV = process.env.NODE_ENV || "development";
const path = require("path");
const proxyPath = `/api/${APP_NAME}/${PARENT_Name}`;
log("APP_NAME: ", APP_NAME);
log("NODE_ENV: ", NODE_ENV);

module.exports = {
  publicPath: `/m/static/${PARENT_Name}/${APP_NAME}/`,

  css: {
    extract: false,
  },

  runtimeCompiler: true,
  productionSourceMap: false,

  chainWebpack: (config) => {
    // if(NODE_ENV === 'production'){
    config.externals({
      vue: "Vue",
    });

    config.output
      .filename("main.js")
      .chunkFilename("[name].[chunkhash:8].js")
      .jsonpFunction(`webpackJsonp-${APP_NAME}`)
      .library(`app-${APP_NAME}`)
      .libraryExport("default")
      .libraryTarget("umd");

    config.optimization.splitChunks(false);
    if (NODE_ENV === "development") {
      config.optimization.minimize(false);
    }

    config.plugin("define").use(webpack.DefinePlugin, [
      {
        "process.env.VUE_APP_NAME": JSON.stringify(APP_NAME),
        "process.env.VUE_PARENT_NAME": JSON.stringify(PARENT_Name),
      },
    ]);

    config.plugins
      // .delete('html')
      .delete("preload")
      .delete("prefetch");
    // }else{
    //   config.output
    //     .filename('main.js')
    //     .chunkFilename('[name].[chunkhash:8].js')
    // }
    const { VuetifyLoaderPlugin } = require("vuetify-loader");

    config
      .plugin("VuetifyLoaderPlugin")
      .use(VuetifyLoaderPlugin)
      .tap((args) => [
        {
          match(originalTag, { kebabTag, camelTag, path, component }) {
            if (kebabTag.startsWith("core-")) {
              return [
                camelTag,
                `import ${camelTag} from '@/components/core/${camelTag.substring(
                  4
                )}.vue'`,
              ];
            }
          },
        },
      ]);
  },
  configureWebpack: {
    resolve: {
      alias: {
        //aliases go here
        "@": path.resolve(__dirname, "src"),
        "@component": path.resolve(__dirname, "src/components"),
        "@node": path.resolve(__dirname, "src/nodes"),
        "@util": path.resolve(__dirname, "src/utils"),
      },
    },
  },
  devServer: {
    port: PORT,
    index: "index.html",
    compress: true,
    headers: {
      "Cache-Control": "no-store",
    },
    proxy: {
      ["/api/"]: {
        target: "http://wishpost.corp.contextlogic.com/",
      },
    },
  },

  transpileDependencies: ["vuetify"],
};

function log(label, content, options) {
  console.log("\x1b[1m%s\x1b[31m%s\x1b[0m", label, content);
}
