# request-env-webpack

[Webpack](http://webpack.github.io/) (v1-5) plugin that gives ability to add callback
before build (or after, or any other [event hook](https://webpack.js.org/api/compiler-hooks/)). 
Can stop compilation by condition.

## Installation

```
npm install --save-dev request-env-webpack
```

## Usage

In config file:

``` javascript
const RequestEnvPlugin = require('request-env-webpack');
// ...
  module: {
    plugins: [
      new RequestEnvPlugin({
        // Axios options...
        url: 'http://some.url/to/get/your/env.json',
        method: 'get'
      }),
    ]
  },
// ...
```
You can find other axios's API options [here](https://github.com/axios/axios#axios-api)
You can use [pre-v4](https://github.com/webpack/webpack.js.org/blob/v3.11.0/src/content/api/compiler.md#event-hooks) or [v4](https://webpack.js.org/api/compiler-hooks/) hook names (i.e. any of `watch-run` and `watchRun`)

