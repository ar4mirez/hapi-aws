'use strict';

const Joi = require('joi');

exports.global = Joi.object({
    region: Joi.string().default('us-east-1'),
    credentials: Joi.object({
        accessKeyId: Joi.string().required(),
        secretAccessKey: Joi.string().required()
    }).optional()
});

exports.services = Joi.array().items(
    Joi.object({
        name: Joi.string().required(),
        client: Joi.any().required()
    })
).default([]);
