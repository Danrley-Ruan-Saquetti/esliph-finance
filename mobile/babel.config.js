module.exports = function (api) {
    api.cache(true)
    return {
        presets: ['babel-preset-expo'],
        plugins: ['nativewind/babel', 'expo-router/babel', [
            'module-resolver',
            {
                root: ['.'],
                alias: {
                    '@router': './src/app',
                    '@assets': './src/assets',
                    '@server': './src/server',
                    '@components': './src/components',
                    '@services': './src/services',
                    '@util': './src/util',
                }
            }
        ]],
    }
}