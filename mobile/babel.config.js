module.exports = function (api) {
    api.cache(true)
    return {
        presets: ['babel-preset-expo'],
        plugins: [
            'expo-router/babel',
            'nativewind/babel',
            [
                'module-resolver',
                {
                    root: ['.'],
                    alias: {
                        '@router': './src/app',
                        '@': './src',
                        '@modules': './src/server/app/modules',
                        '@@types': './src/server/@types',
                    },
                },
            ],
        ],
        ignore: ['node_modules', 'scripts'],
    }
}
