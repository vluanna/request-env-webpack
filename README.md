# request-env-webpack

[Webpack](http://webpack.github.io/) (v1-5) plugin that allow you to request environment variables from an url by using [axios](https://github.com/axios/axios) requests
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
      }), // response: ( data: { data: [{ key: 'APP_DATA', value: 'test' }], error: [] } )
    ]
  },
// ...
```
In js file:

``` javascript
// src/index.js
// ...
  console.log(process.env.APP_DATA) // output: "test"
// ...
```


You can find other axios's API options [here](https://github.com/axios/axios#axios-api)

By default, environment variables will load from .env files, more informations [here](https://github.com/motdotla/dotenv#readme)

