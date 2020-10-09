module.exports = {
    chainWebpack: config => {
        // 发布模式
        config.when(process.NODE_ENV === 'production', config => {
            config.entry('app').clear().add('./src/main.js')
            // config.set('externals',{
            //     vue:'vue',
            //     'vue-router':'vue-router',
            //     axios:'axios',
            //     echarts:'echarts',
            //     nprogerss:'Nprogress',
            //     'vue-quill-editor':'VueQuillEditor'
            // })
            config.plugin('html').tap(args => {
                args[0].isProd = true
                return args
            })
        })
        // 开发模式
        config.when(process.NODE_ENV === 'development', config => {
            config.entry('app').clear().add('./src/main-dev.js')
            config.plugin('html').tap(args => {
                args[0].isProd = false
                return args
            })
        })
    }
}