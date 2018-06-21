'use strict';

const Joi = require('joi');

exports.global = Joi.object().keys({
    accessKeyId: Joi.string(),
    secretAccessKey: Joi.string(),
    region: Joi.string().default('us-east-1')
}).requiredKeys(['accessKeyId', 'secretAccessKey', 'region']);

exports.services = Joi.array().items(
    Joi.object({
        name: Joi.string(),
        service: Joi.string(),
        options: Joi.object().default({})
    }).requiredKeys(['name', 'service'])
);
