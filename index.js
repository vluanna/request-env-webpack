const axios = require("axios");
const webpack = require("webpack");
const dotEnv = require("dotenv");

const setEnv = (env, compiler) => {
    const envObj = {};
    Object.keys(env || {}).forEach((key) => {
        envObj[key] = env[key];
    });
    process.env = Object.assign(process.env, envObj)
    new webpack.DefinePlugin({
        "process.env": JSON.stringify(envObj),
    }).apply(compiler);
};

const pluginName = "RequestEnvWebpack";

module.exports = class RequestEnvWebpack {
    
    static defaultOptions = {
        url: null,
        method: 'GET'
    };

    constructor(options = {}) {
        this.options = { ...RequestEnvWebpack.defaultOptions, ...options };
    }
    apply(compiler) {
        if (!this.options.url) {
            compiler.hooks.environment.tap(
                pluginName,
                (compilation) => {
                    setEnv(dotEnv.config().parsed, compiler);
                }
            );
        } else {
            compiler.hooks.beforeRun.tapAsync(
                pluginName,
                async (compilation, callback) => {
                    try {
                        const configResp = await axios(this.options);
                        if (configResp.data.isSuccess) {
                            const envObj = {};
                            (configResp.data.data || []).forEach(item => {
                                envObj[item.key] = item.value;
                            })
                            setEnv(envObj, compiler);
                        } else {
                            throw new Error("Cannot get config from url:" + JSON.stringify(configResp.data.errors));
                        }
                    } catch (error) {
                        throw new Error("Cannot get config from url:" + String(error));
                    }
                    callback();
                }
            );
        }

    }
};
