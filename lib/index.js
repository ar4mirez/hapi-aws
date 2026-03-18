'use strict';

const Joi = require('joi');
const Schemas = require('./schemas');

const validateOptions = {
    abortEarly: false
};

exports.plugin = {
    pkg: require('../package.json'),

    register: async (server, options) => {

        const { error: globalError, value: globalConfig } = Schemas.global.validate(
            options.global || {},
            validateOptions
        );

        if (globalError) {
            throw globalError;
        }

        const { error: servicesError, value: servicesConfig } = Schemas.services.validate(
            options.services || [],
            validateOptions
        );

        if (servicesError) {
            throw servicesError;
        }

        const services = {};

        for (const item of servicesConfig) {
            // item.client is a pre-instantiated AWS SDK v3 client
            services[item.name] = item.client;
        }

        server.expose('aws', services);
        server.decorate('server', 'aws', services);
        server.decorate('request', 'aws', services);
    }
};
