import routes from './routes';
export default {
    name: process.env.VUE_APP_NAME,
    routes,
    beforeEach(from, to, next) {
        console.log("micro:", process.env.VUE_APP_NAME, from.path, to.path);
        next();
    },
    init() { },
}


// when start on local below code is used to init vue
if (global.Vue.__share_pool__ == null && process.env.NODE_ENV === 'development') {
    const init_mock_vue=require('@/dev/init').default;
    init_mock_vue()
}