'use strict';

const Lab = require('@hapi/lab');
const Code = require('@hapi/code');
const Hapi = require('@hapi/hapi');
const { CodeCommitClient } = require('@aws-sdk/client-codecommit');
const Plugin = require('..');
const Pkg = require('../package.json');

const { describe, it, beforeEach } = exports.lab = Lab.script();
const { expect } = Code;

let server;

const register = async (options) => {

    await server.register({
        plugin: Plugin,
        options
    });
};

describe('Plugin Registration', () => {

    beforeEach(async () => {

        server = new Hapi.Server();
    });

    it('it registers successfully', async () => {

        const options = {
            global: {
                region: 'us-east-1'
            },
            services: []
        };

        await register(options);
    });

    it('it registers successfully with credentials', async () => {

        const options = {
            global: {
                credentials: {
                    accessKeyId: 'anything',
                    secretAccessKey: 'anything'
                },
                region: 'us-east-1'
            },
            services: []
        };

        await register(options);
    });

    it('it returns error if service is missing required client', async () => {

        const options = {
            global: { region: 'us-east-1' },
            services: [{ name: 'myService' }]
        };

        let err;
        try {
            await register(options);
        }
        catch (e) {
            err = e;
        }

        expect(err).to.exist();
    });

    it('it successfully registers and exposes a pre-instantiated service client', async () => {

        const client = new CodeCommitClient({ region: 'us-east-1' });

        const options = {
            global: { region: 'us-east-1' },
            services: [{
                name: 'codeCommit',
                client
            }]
        };

        await register(options);

        const plugin = server.plugins[Pkg.name];
        expect(server.aws).to.exist();
        expect(plugin.aws).to.exist();
        expect(plugin.aws.codeCommit).to.exist();
        expect(plugin.aws.codeCommit).to.be.an.instanceof(CodeCommitClient);
    });
});
