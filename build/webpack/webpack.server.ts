import * as path from 'path';
import * as webpack from 'webpack';
import * as webpackNodeExternals from 'webpack-node-externals';

const configuration: webpack.Configuration = {
  target: 'node',
  mode: 'production',
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
  },
  optimization: {
    minimize: false
  }
};

// tslint:disable-next-line:no-default-export
export default configuration;
