'use strict';

const Lab = require('lab');
const Code = require('code');
const Hapi = require('hapi');
const AWS = require('aws-sdk');
const Plugin = require('..');
const Pkg = require('../package.json');

const lab = exports.lab = Lab.script();

const { describe, it, beforeEach } = lab;

let server;

const register = async (options) => {

    await server.register({
        plugin: Plugin,
        options
    });
};


describe('Plugin Registration', () => {

    beforeEach(() => {

        server = new Hapi.Server();
    });

    it('it registers successfully', async () => {

        const options = {
            global: {
                accessKeyId: 'anything',
                secretAccessKey: 'anything',
                region: 'anything'
            },
            services: []
        };

        try {
            await register(options);
        }
        catch (error) {
            Code.expect(error).to.not.exist();
        }

    });

    it('it returns error if required keys are not passed', async () => {

        const options = {
            global: {
                region: 'anything'
            },
            services: [{
                service: 'unknownService'
            }]
        };

        try {
            await register(options);
        }
        catch (error) {
            Code.expect(error).to.exist();
        }
    });

    it('it returns error if wrong formed service is passed.', async () => {

        const options = {
            global: {
                accessKeyId: 'anything',
                secretAccessKey: 'anything',
                region: 'anything'
            },
            services: [{
                service: 'unknownService'
            }]
        };

        try {
            await register(options);
        }
        catch (error) {
            Code.expect(error).to.exist();
        }
    });

    it('it successfully register and expose a service.', async () => {

        const options = {
            global: {
                accessKeyId: 'anything',
                secretAccessKey: 'anything',
                region: 'anything'
            },
            services: [{
                name: 'codeCommit',
                service: 'CodeCommit'
            }]
        };

        try {
            await register(options);
        }
        catch (error) {
            const plugin = server.plugins[Pkg.name];
            Code.expect(error).to.not.exist();
            Code.expect(server).to.include('aws');
            Code.expect(plugin).to.include('aws');
            Code.expect(plugin.aws).to.include('codeCommit');
            Code.expect(plugin.aws.codeCommit).to.be.an.instanceOf(AWS.CodeCommit);
        }
    });
});
