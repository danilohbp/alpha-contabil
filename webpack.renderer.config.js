const path = require('path');

module.exports = {
  mode: 'development',
  entry: './src/renderer.js',
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: 'babel-loader'
      },
      {
        test: /\.css$/i,
        use: ['style-loader', 'css-loader', 'postcss-loader']
      }           
    ]
  },
  resolve: {
    extensions: ['.js', '.jsx']
  },
  devServer: {
    host: 'localhost',       // ← Corrige para localhost
    port: 3000,               // ← Usa a porta que o Electron espera
    hot: true,                // ← Ativa Hot Module Replacement
    devMiddleware: {
      publicPath: '/',
    },
    static: {
      directory: path.join(__dirname, 'dist'), // ← Para servir arquivos estáticos
    },
    headers: {
      "Access-Control-Allow-Origin": "*"
    }
  }
};