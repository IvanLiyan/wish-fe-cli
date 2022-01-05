/* routes-list */

const APP_NAME = process.env.VUE_APP_NAME;

export default [
  {
    path: `${APP_NAME}`,
    redirect: `${APP_NAME}/change-phone`,
  },
  {
    path: `${APP_NAME}/change-phone`,
    name: `${APP_NAME}.change-phone`,
    component: () =>
      import(
        /* webpackChunkName: "change-phone" */
        "@node/change-phone/index"
      ),
  },
  {
    path: `${APP_NAME}/change-email`,
    name: `${APP_NAME}.change-email`,
    component: () =>
      import(
        /* webpackChunkName: "change-email" */
        "@node/change-email/index"
      ),
  },
];
