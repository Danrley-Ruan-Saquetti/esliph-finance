module.exports = function (api) {
    api.cache(true)
    return {
        presets: ['babel-preset-expo'],
        plugins: [
            'nativewind/babel',
            'expo-router/babel', [
                'module-resolver',
                {
                    root: '.',
                    alias: {
                        '@router': './app',
                        '@assets': './assets',
                        '@server': './server',
                        '@components': './components',
                        '@services': './services',
                        '@util': './util',
                    }
                }
            ]
        ],
    }
}