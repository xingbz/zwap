const { VantResolver } = require("@vant/auto-import-resolver");
const ComponentsPlugin = require("unplugin-vue-components/webpack");

module.exports = {
    configureWebpack: {
        plugins: [
            ComponentsPlugin({ resolvers: [VantResolver()] })
        ],
    },
    // devServer: {
    //     proxy: {
    //         '/weather-api': {
    //             target: 'https://oms-api.adsdesk.cn',
    //             changeOrigin: true,
    //             pathRewrite: {
    //                 '^/weather-api': ''
    //             },
    //             headers: {
    //                 'authCode': '7oVHfjE7XQJh+G+ML2u7Uqx6sunH', // 替换为实际API密钥
    //             }
    //         }
    //     }
    // },
    publicPath: process.env.NODE_ENV === 'production' ? '/zwap/' : '/'
}
    ;
