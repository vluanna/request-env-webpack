const axios = require("axios");
const webpack = require("webpack");
const dotEnv = require("dotenv");
const fs = require('fs');

const setEnv = (env, compiler) => {
    const envObj = {};
    Object.keys(env || {}).forEach((key) => {
        envObj[key] = env[key];
    });
    process.env = Object.assign(process.env, envObj)
    const envStringData = JSON.stringify(envObj)
    new webpack.DefinePlugin({
        "process.env": envStringData,
    }).apply(compiler);
};

const configParser = (config) => config && config.data;

const pluginName = "RequestEnvWebpack";

module.exports = class RequestEnvWebpack {

    static defaultOptions = {
        url: null,
        method: 'GET',
        configPath: process.env.CONFIG_PATH,
        configParser,
    };

    constructor(options = {}) {
        this.options = { ...RequestEnvWebpack.defaultOptions, ...options };
    }
    apply(compiler) {
        if (this.options.configPath) {
            compiler.hooks.beforeRun.tapAsync(
                pluginName,
                async (compilation, callback) => {
                    const configPath = this.options.configPath || process.env.CONFIG_PATH;
                    try {
                        const rawConfig = fs.readFileSync(configPath);
                        const config = JSON.parse(rawConfig);
                        setEnv(this.options.configParser(config), compiler)
                    } catch (error) {
                        throw new Error(pluginName + ": Cannot get config from config path:" + configPath + 'Error: ' + JSON.stringify(error));
                    }
                    callback();
                }
            );
        } else if (!this.options.url) {
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
                            setEnv(this.options.configParser({ data: envObj }), compiler);
                        } else {
                            throw new Error(pluginName + ": Cannot get config from url:" + JSON.stringify(configResp.data.errors));
                        }
                    } catch (error) {
                        throw new Error(pluginName + ": Cannot get config from url:" + String(error));
                    }
                    callback();
                }
            );
        }

    }
};
