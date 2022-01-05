export default () => {
  const Vue = global.Vue;

  const moduleStore = require("@/store/index").default;
  const Vuex = require("vuex").default;
  Vue.use(Vuex);

  import(
    /* webpackChunkName: "materialdesignicons" */ "@mdi/font/css/materialdesignicons.css"
  );
  import(/* webpackChunkName: "vuetifycss" */ "vuetify/dist/vuetify.min.css");
  import(
    /* webpackChunkName: "material-design-icons" */ "material-design-icons-iconfont/dist/material-design-icons.css"
  );

  const APP_NAME = process.env.VUE_APP_NAME;
  const PARENT_NAME = process.env.VUE_PARENT_NAME;

  const store = new Vuex.Store({
    state: {
      name: "sub-module-entry",
    },
    mutations: {},
    actions: {},
  });
  store.registerModule(process.env.VUE_APP_NAME, moduleStore);

  const themes = {
    // Text colors
    white: "#FFFFFF",
    placeholder: "#AFC7D1",
    ink: {
      darken1: "#3E5159",
      base: "#192A32",
    },

    // Background Grey colors
    grey: {
      lighten1: "#F0F5F7",
      base: "#7790A3",
    },
    sectionHead: "#6A9ECA",

    // Slot colors
    empty: "#F0F5F9",
    processing: "#99E2EF",
    ready: "#255D8D",
    goodtogo: "#D5F5EB",
    lost: "#8FB6D7",
    skipped: "#D85D71",
    focuesd: "#EF8D2E",

    // Information colors
    error: "#CA213C",
    info: "#6A9ECA",
    warning: "#EF8D2E",
    success: "#5FA906",

    // Primary colors
    primary: "#2FB7EC",
    accent: "#337AB7",

    // Secondary colors
    secondary: "#D1AF00",
    secondaryAccent: "#C47426",

    // parcel status colors
    // TODO: simiao provided
    pending: "#ECF8FD",
    return: "#E51C23",
    inboundPending: "#EF8D2E",
    inboundCombine: "#99E2EF",
    shipped: "#8FB6D7",
    directShip: "#5FA906",
    cancelled: "#7790A3",
  };

  const Vuetify = require("vuetify/lib").default;
  Vue.use(Vuetify);
  const vuetify = new Vuetify({
    theme: {
      options: {
        customProperties: true,
      },
      themes: {
        light: themes,
        dark: themes,
      },
    },
  });

  Vue.use(require("vuetify-confirm"), { vuetify: vuetify });
  Vue.use(require("vue-moment"));
  const VueI18n = require("vue-i18n").default;
  Vue.use(VueI18n);
  const messages = {
    en: {
      message: {
        hello: "hello world",
      },
    },
  };
  const i18n = new VueI18n({
    locale: "en", // set locale
    messages, // set locale messages
  });
  Vue.mixin({
    methods: {
      i18n: (str) => {
        return str;
      },
    },
  });

  const VueRouter = require("vue-router").default;
  Vue.use(VueRouter);
  const router = new VueRouter({
    routes: [
      {
        path: "/",
        redirect: `/${PARENT_NAME}`,
      },
      {
        path: `/${PARENT_NAME}`,
        name: PARENT_NAME,
        redirect: `/${PARENT_NAME}/${APP_NAME}`,
        component: () =>
          import(
            /* webpackChunkName: "mock-container" */
            "@/dev/MockContainer"
          ),
        children: [],
      },
      {
        path: `/${PARENT_NAME}/${APP_NAME}/login`,
        component: () =>
          import(
            /* webpackChunkName: "login" */
            "@/dev/Login"
          ),
      },
    ],
  });
  const routes = require("@/routes").default;
  routes.forEach((r) => router.addRoute(PARENT_NAME, r));

  new Vue({
    i18n,
    router,
    store,
    vuetify,

    render(h) {
      return h("router-view");
    },
  }).$mount("#app");
};
