const { VantResolver } = require("@vant/auto-import-resolver");
const ComponentsPlugin = require("unplugin-vue-components/webpack");

module.exports = {
    configureWebpack: {
        plugins: [
            ComponentsPlugin({ resolvers: [VantResolver()] })
        ],
    },
    devServer: {
        proxy: {
            '/weather-api': {
                target: 'https://pb3fbxwcuk.re.qweatherapi.com',
                changeOrigin: true,
                pathRewrite: {
                    '^/weather-api': ''
                },
                headers: {
                    'x-qw-api-key': '733e859747ba4d668da716858de578a8', // 替换为实际API密钥
                }
            }
        }
    },
    publicPath: process.env.NODE_ENV === 'production' ? '/zwap/' : '/'
}
    ;
