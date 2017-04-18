# hapi-aws

AWS plugin for HapiJS.

[![travis build](https://img.shields.io/travis/ar4mirez/hapi-aws.svg?style=flat-square)](https://travis-ci.org/ar4mirez/hapi-aws)
[![codecov coverage](https://img.shields.io/codecov/c/github/ar4mirez/hapi-aws.svg?style=flat-square)](https://codecov.io/github/ar4mirez/hapi-aws)
[![version](https://img.shields.io/npm/v/hapi-aws.svg?style=flat-square)](http://npm.im/hapi-aws)
[![downloads](https://img.shields.io/npm/dm/hapi-aws.svg?style=flat-square)](http://npm-stat.com/charts.html?package=hapi-aws&from=2015-08-01)
[![semantic-release](https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg?style=flat-square)](https://github.com/semantic-release/semantic-release)

[![Dependency Status](https://david-dm.org/ar4mirez/hapi-aws.svg)](https://david-dm.org/ar4mirez/hapi-aws)
[![devDependency Status](https://david-dm.org/ar4mirez/hapi-aws/dev-status.svg?theme=shields.io)](https://david-dm.org/ar4mirez/hapi-aws?type=dev)
[![Build Status](https://travis-ci.org/ar4mirez/hapi-aws.svg?branch=master)](https://travis-ci.org/ar4mirez/hapi-aws)


## Install

```bash
$ npm install hapi-aws
```


## Usage

```javascript
// Using server register.

server.register({
    register: require('hapi-aws'),
    options: {
        global: {
            accessKeyId: 'accessKeyId',
            secretAccessKey: 'secretAccessKey',
            region: 'us-east-1'
        },
        services: [{
            name: 'ec2Identification',
            service: 'EC2',
            options: {
                accessKeyId: 'anotherAccessKeyId',
                secretAccessKey: 'anotherSecretAccessKey',
            }
        }, {
            name: 's3Identification',
            service: 'S3',
            options: {
                region: 'us-west-2'
            }
        }]
    }
})

// Using manifest.
{
    ...
    registration: [{
        plugin: 'hapi-aws',
        options: {
            global: {
                accessKeyId: 'accessKeyId',
                secretAccessKey: 'secretAccessKey',
                region: 'us-east-1'
            },
            services: [{
                name: 's3Identification',
                service: 'S3',
                options: {
                    region: 'us-west-2'
                }
            }]
        }
    }]
}
```

## AWS Supported services
Check the following services here: [AWS Services](https://github.com/aws/aws-sdk-js/blob/master/SERVICES.md)

***When passing a service please drop the AWS namespace example:***

`service.name: [string]` used later to access the service like: `server.plugins['hapi-aws'].aws.ec2Identification`

`service.service: [string]` from the previous list exmple: `EC2`
