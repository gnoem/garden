const path = require('path');

exports.onCreateWebpackConfig = ({ actions }) => {
  actions.setWebpackConfig({
    resolve: {
      alias: {
        '@assets': path.resolve(__dirname, 'src/assets'),
        '@components': path.resolve(__dirname, 'src/components'),
        '@config': path.resolve(__dirname, 'src/config'),
        '@contexts': path.resolve(__dirname, 'src/contexts'),
        '@hooks': path.resolve(__dirname, 'src/hooks'),
        '@layouts': path.resolve(__dirname, 'src/layouts'),
        '@lib': path.resolve(__dirname, 'src/lib'),
        '@models': path.resolve(__dirname, 'src/models'),
        '@styles': path.resolve(__dirname, 'src/styles'),
        '@themes': path.resolve(__dirname, 'src/themes'),
        '@types': path.resolve(__dirname, 'src/types'),
        '@utils': path.resolve(__dirname, 'src/utils'),
      },
      extensions: ["", ".ts", ".tsx", ".js"]
    },
  });
}