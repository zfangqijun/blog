+++
{
    "date": "2020-01-05",
    "tag": "webpackprj",
    "title": "使用Webpack构建前端工程"
}
+++
# 使用Webpack构建前端工程

## 安装Webpack

新建一个工程目录，执行初始化命令(这里采用yarn)

```bash
yarn init
```

安装webpack、webpack-cli，webpack是核心模块，webpack-cli则是命令行工具

```bash
yarn add -D webpack webpack-cli
```

## 安装webpack-dev-server

在webpack.config.js中的devServer字段专门用来存放该模块的配置

该模块的主要工作是接收浏览器的请求，然后将资源返回

服务启动时，会先让webpack进行打包并将资源准备好，且每次修改代码都会重新打包更新，方便调试

```bash
yarn add -D webpack-dev-server
```

## 安装react、react-dom

```bash
yarn add react react-dom
```

## 安装相关loader

```bash
yarn add -D @babel/core babel-loader
```

## 安装react预编译babel

由于本工程使用react，故需要安装react的预编译babel

```bash
yarn add -D @babel/preset-react
```

## 安装需要用到的plugin

terser-webpack-plugin用于生产环境压缩代码

copy-webpack-plugin用于拷贝部分静态文件

```bash
yarn add -D terser-webpack-plugin copy-webpack-plugin html-webpack-plugin
```

## 安装cross-env

该模块用于设置环境变量，且兼容Mac os、Windows、Linux

```bash
yarn add -D cross-env
```

## 新建必要文件

webpack.config.js

```js
const path = require('path');
const TerserPlugin = require('terser-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const isProd = process.env.NODE_ENV === 'production';

const config = {
  mode: isProd ? 'production' : 'development',
  devServer: {
    host: '0.0.0.0',
    port: 2188,
  },
  devtool: 'source-map',
  entry: {
    'gui': './src/index.jsx',
    'lib.min': ['react', 'react-dom']
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].js'
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        loader: 'babel-loader',
        options: {
          presets: ['@babel/preset-react']
        }
      },
      {
        test: /\.(svg|png|wav|gif|jpg)$/,
        loader: 'file-loader',
        options: {
          outputPath: 'static/assets/',
          publicPath: 'static/assets/'
        }
      }
    ]
  },
  optimization: {
    splitChunks: {
      chunks: 'all',
      name: 'lib.min'
    },
    runtimeChunk: {
      name: 'lib.min'
    },
    minimizer: [
      new TerserPlugin({
        extractComments: true,
        sourceMap: true,
      }),
    ],
  },
  plugins: [
    new CopyWebpackPlugin([{
      from: 'static',
      to: 'static'
    }]),
    new HtmlWebpackPlugin({
      template: 'index.html',
    })
  ]
};

module.exports = config;
```

index.html

```html
<!DOCTYPE html>
<html>
<head>
    <title>myweb</title>
</head>
<body>
    <div id='root'></div>
</body>
</html>
```

src/app.jsx

```jsx
import React from 'react';

const App = () => {
    return (
        <div>
            hello
        </div>
    )
}

export default App;
```

src/index.jsx

```jsx
import React from 'react';
import ReactDOM from 'react-dom';
import App from './app.jsx';

const root = document.getElementById('root');
ReactDOM.render(<App />, root);
```

package.json

```json
{
  "name": "myweb",
  "version": "1.0.0",
  "scripts": {
    "build": "npm run clean && cross-env NODE_ENV=production webpack",
    "dev": "webpack-dev-server",
    "clean": "rimraf ./dist && mkdirp dist"
  },
  "devDependencies": {
    "@babel/core": "^7.8.7",
    "@babel/preset-react": "^7.8.3",
    "babel-loader": "^8.0.6",
    "copy-webpack-plugin": "^5.1.1",
    "cross-env": "^7.0.2",
    "file-loader": "^6.0.0",
    "html-webpack-plugin": "^3.2.0",
    "lodash": "^4.17.15",
    "rimraf": "^3.0.2",
    "terser-webpack-plugin": "^2.3.5",
    "uglifyjs-webpack-plugin": "^2.2.0",
    "webpack": "^4.42.0",
    "webpack-cli": "^3.3.11",
    "webpack-dev-server": "^3.10.3"
  },
  "dependencies": {
    "react": "^16.13.0",
    "react-dom": "^16.13.0",
    "styled-components": "^5.0.1"
  }
}
```

## 开发环境

执行dev即可使用webpack-dev-server启动本地开发环境

"dev": "webpack-dev-server"

```bash
yarn dev
```

![img](/images/webpack-fe.png)

## 生产环境

执行build即可打包到dist

"build": "npm run clean && cross-env NODE_ENV=production webpack"

```bash
yarn build
```
