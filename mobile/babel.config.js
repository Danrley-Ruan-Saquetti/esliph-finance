module.exports = function (api) {
    api.cache(true)
    return {
        presets: ['babel-preset-expo'],
        plugins: [
            'expo-router/babel',
            'nativewind/babel', [
                'module-resolver',
                {
                    root: ['.'],
                    alias: {
                        '@router': './src/app',
                        '@': './src',
                    },
                },
            ],
        ],
        ignore: ['node_modules', 'scripts'],
    }
}