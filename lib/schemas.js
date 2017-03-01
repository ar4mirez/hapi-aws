'use strict';

const Joi = require('joi');
const AWSConstants = require('./aws-contants');

exports.global = Joi.object().keys({
    accessKeyId: Joi.string(),
    secretAccessKey: Joi.string(),
    region: Joi.string().default('us-east-1'),
    sslEnabled: Joi.boolean().default(false),
    paramValidation: Joi.object({
        min: Joi.boolean().default(true),
        max: Joi.boolean().default(true),
        pattern: Joi.boolean().default(true),
        enum: Joi.boolean().default(true)
    }),
    convertResponseTypes: Joi.boolean().default(true),
    httpOptions: Joi.object({
        proxy: Joi.string(),
        agent: Joi.any(),
        timeout: Joi.number().integer().default(120000),
        xhrAsync: Joi.boolean().default(true),
        xhrWithCredentials: Joi.boolean().default(false)
    }),
    apiVersion: Joi.alternatives(
        Joi.string()
            .regex(/^(\d{4})-([1-9]|[12][0-9]|3[01])-(0[1-9]|1[0-2])$/)
            .allow('latest')
            .default('latest'),
        Joi.date()
    ).default('latest'),
    apiVersions: Joi.array().items(Joi.object()),
    logger: Joi.any(),
    systemClockOffset: Joi.number().positive().allow(0).default(0),
    signatureVersion: Joi.string().valid(['v2', 'v3', 'v4']).default('v4'),
    signatureCache: Joi.boolean().default(true)
})
    .requiredKeys(['accessKeyId', 'secretAccessKey', 'region']);

exports.services = Joi.array().items(
    Joi.object({
        name: Joi.string(),
        service: Joi.string().valid(AWSConstants.AWS_SERVICES),
        options: Joi.object().default({})
    })
        .requiredKeys(['name', 'service'])
);
