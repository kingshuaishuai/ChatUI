module.exports = (api) => {
  const env = api.env();
  api.cache.using(() => env === 'development');

  return {
    presets: ['@babel/preset-env', '@babel/preset-typescript'],
    plugins: [
      '@vue/babel-plugin-jsx',
      '@babel/plugin-transform-runtime',
    ],
    env: {
      esm: {
        presets: [
          [
            '@babel/preset-env',
            {
              modules: false,
            },
          ],
        ],
        plugins: [
          [
            '@babel/plugin-transform-runtime',
            {
              useESModules: true,
            },
          ],
        ],
      },
      umd: {
        presets: [
          [
            '@babel/preset-env',
            {
              targets: {
                android: '4.4',
                ios: '9',
              },
              useBuiltIns: 'usage',
              corejs: 3,
            },
          ],
        ],
        plugins: [['@babel/plugin-transform-runtime', { corejs: 3 }]],
      },
    },
  };
};
