'use strict';

const Lab = require('lab');
const Code = require('code');
const Hapi = require('hapi');
const AWS = require('aws-sdk');
const Plugin = require('..');
const Pkg = require('../package.json');

const lab = exports.lab = Lab.script();

let server;

const register = (options, callback) => {

    server.register({
        register: Plugin,
        options
    }, callback);
};


lab.describe('Plugin Registration', () => {

    lab.beforeEach((callback) => {

        server = new Hapi.Server();
        server.connection();

        return callback();
    });

    lab.it('it registers successfully', (done) => {

        const options = {
            global: {
                accessKeyId: 'anything',
                secretAccessKey: 'anything',
                region: 'anything'
            },
            services: []
        };

        register(options, (error) => {

            Code.expect(error).to.not.exist();

            return done();
        });
    });

    lab.it('it returns an error if no global config were passed.', (done) => {

        register({}, (error) => {

            Code.expect(error).to.exist();

            return done();
        });
    });

    lab.it('it returns an error if no services config were passed.', (done) => {

        register({
            global: {
                accessKeyId: 'anything',
                secretAccessKey: 'anything',
                region: 'anything'
            }
        }, (error) => {

            Code.expect(error).to.exist();

            return done();
        });
    });

    lab.it('it returns error if wrong formed service is passed.', (done) => {

        register({
            global: {
                accessKeyId: 'anything',
                secretAccessKey: 'anything',
                region: 'anything'
            },
            services: [{
                service: 'unknownService'
            }]
        }, (error) => {

            Code.expect(error).to.exist();

            return done();
        });
    });

    lab.it('it successfully register and expose a service.', (done) => {

        register({
            global: {
                accessKeyId: 'anything',
                secretAccessKey: 'anything',
                region: 'anything'
            },
            services: [{
                name: 'codeCommit',
                service: 'CodeCommit'
            }]
        }, (error) => {

            const plugin = server.plugins[Pkg.name];
            Code.expect(error).to.not.exist();
            Code.expect(server).to.include('aws');
            Code.expect(plugin).to.include('aws');
            Code.expect(plugin.aws).to.include('codeCommit');
            Code.expect(plugin.aws.codeCommit).to.be.an.instanceOf(AWS.CodeCommit);

            return done();
        });
    });
});
