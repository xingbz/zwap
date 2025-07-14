const {VantResolver} = require("@vant/auto-import-resolver");
const ComponentsPlugin = require("unplugin-vue-components/webpack");

module.exports = {
    configureWebpack: {
        plugins: [
            ComponentsPlugin({resolvers: [VantResolver()]})
        ],
    },
    publicPath: process.env.NODE_ENV === 'production' ? '/zwap/' : '/'
}
;
