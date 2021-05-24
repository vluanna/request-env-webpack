const axios = require("axios");
const webpack = require("webpack");
const dotEnv = require("dotenv");

module.exports = class RequestEnvWebpack {
    static defaultOptions = {
        url: null,
        method: 'GET'
    };
    constructor(options = {}) {
        this.options = { ...RequestEnvWebpack.defaultOptions, ...options };
    }
    apply(compiler) {
        compiler.hooks.beforeRun.tapAsync(
            "RequestEnvWebpack",
            async (compilation, callback) => {
                const setEnv = (env) => {
                    const envObj = {};
                    Object.keys(env || {}).forEach((key) => {
                        envObj[key] = env[key];
                    });
                    new webpack.DefinePlugin({
                        "process.env": JSON.stringify(envObj),
                    }).apply(compiler);
                };
                if (!this.options.url) {
                    setEnv(dotEnv.config().parsed);
                } else {
                    try {
                        const configResp = await axios(this.options);
                        if (configResp.data.isSuccess) {
                            const envObj = {};
                            (configResp.data.data || []).forEach(item => {
                                envObj[item.key] = item.value;
                            })
                            setEnv(envObj);
                        } else {
                            throw new Error("Cannot get config from url:" + JSON.stringify(configResp.data.errors));
                        }
                    } catch (error) {
                        throw new Error("Cannot get config from url:" + String(error));
                    }
                }
                callback();
            }
        );
    }
};
