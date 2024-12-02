const path = require('path');

module.exports = {
  entry: './background.js', 
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist'),
  },
  mode: 'production',
  resolve: {
    fallback: {
      "fs": false,
      "path": require.resolve("path-browserify")
    }
  }
};