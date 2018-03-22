import * as path from 'path';
import * as webpackNodeExternals from 'webpack-node-externals';

// tslint:disable-next-line:no-default-export
export default {
  target: 'node',
  devtool: 'source-map',
  externals: [webpackNodeExternals()],
  entry: {
    server: './src/server/main.ts'
  },
  output: {
    path: path.resolve('./dist/server'),
    filename: '[name].js'
  },
  stats: {
    assets: true,
    children: false
  },
  resolve: {
    extensions: ['.js', '.ts']
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        loader: 'ts-loader'
      }
    ]
  }
};
