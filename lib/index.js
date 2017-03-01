'use strict';

const Aws = require('aws-sdk');
const Async = require('async');
const Joi = require('joi');
const Hoek = require('hoek');
const Schemas = require('./schemas');

const validateOptions = {
    abortEarly: false
};

exports.register = function (server, options, next) {

    options = Hoek.applyToDefaults({
        global: {},
        services: []
    }, options);

    Async.auto({
        globalConfig: (callback) => {

            return Schemas.global.validate(options.global, validateOptions, callback);
        },
        serviceConfig: ['globalConfig', (data, callback) => {

            return Joi.validate(options.services, Schemas.services, validateOptions, callback);
        }],
        awsInstance: ['globalConfig', (data, callback) => {

            const instance = new Aws.Config(data.globalConfig);

            return callback(null, instance);
        }],
        services: ['awsInstance', (data, callback) => {

            const services = {};

            options.services.map((item) => {

                const Service = Aws[item.service];
                services[item.name] = new Service(item.options);
            });

            return callback(null, services);
        }]
    }, (error, result) => {

        if (error) {
            return next(error);
        }

        server.expose('aws', result.services);
        server.decorate('server', 'aws', result.services);
        server.decorate('request', 'aws', result.services);

        return next(null, result);
    });
};


exports.register.attributes = {
    pkg: require('../package.json')
};
