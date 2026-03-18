# hapi-aws

[![npm version](https://img.shields.io/npm/v/@ar4mirez/hapi-aws.svg)](https://www.npmjs.com/package/@ar4mirez/hapi-aws)
[![CI](https://github.com/ar4mirez/hapi-aws/actions/workflows/ci.yml/badge.svg)](https://github.com/ar4mirez/hapi-aws/actions)
[![License: ISC](https://img.shields.io/badge/License-ISC-blue.svg)](https://opensource.org/licenses/ISC)

AWS SDK v3 plugin for HapiJS — instantiate and expose AWS service clients via server and request decorators.

## Requirements

- Node.js >= 18
- `@hapi/hapi` ^21
- AWS SDK v3 client packages (e.g. `@aws-sdk/client-s3`)

## Installation

```bash
npm install @ar4mirez/hapi-aws
```

Install the AWS SDK v3 clients you need separately:

```bash
npm install @aws-sdk/client-s3 @aws-sdk/client-dynamodb
```

## Usage

```js
const Hapi = require('@hapi/hapi');
const { S3Client } = require('@aws-sdk/client-s3');
const { DynamoDBClient } = require('@aws-sdk/client-dynamodb');

const init = async () => {
  const server = new Hapi.Server({ host: 'localhost', port: 3000 });

  await server.register({
    plugin: require('@ar4mirez/hapi-aws'),
    options: {
      global: {
        region: 'us-east-1'
        // credentials: { accessKeyId: '...', secretAccessKey: '...' }
        // Prefer environment variables or IAM roles over hardcoded credentials
      },
      services: [
        { name: 's3',     client: new S3Client({ region: 'us-east-1' }) },
        { name: 'dynamo', client: new DynamoDBClient({ region: 'us-east-1' }) }
      ]
    }
  });

  // Clients are available on server.aws, request.aws, and
  // server.plugins['@ar4mirez/hapi-aws'].aws

  server.route({
    method: 'GET',
    path: '/files',
    handler: async (request, h) => {
      const { ListBucketsCommand } = require('@aws-sdk/client-s3');
      const result = await request.aws.s3.send(new ListBucketsCommand({}));
      return result.Buckets;
    }
  });

  await server.start();
  console.log(`Server running at: ${server.info.uri}`);
};

init();
```

## API / Options

| Option                    | Type   | Default      | Description                                               |
|--------------------------|--------|--------------|-----------------------------------------------------------|
| `global`                 | object | `{}`         | Global AWS configuration (applied before services start)  |
| `global.region`          | string | `'us-east-1'`| AWS region                                                |
| `global.credentials`     | object | —            | `{ accessKeyId, secretAccessKey }` — prefer env/IAM roles |
| `services`               | array  | `[]`         | List of AWS client entries to register                    |
| `services[].name`        | string | —            | Key name to expose on `server.aws` / `request.aws`        |
| `services[].client`      | object | —            | Pre-instantiated AWS SDK v3 client                        |

### Decorated accessors

After registration, clients are accessible via:

- `server.aws.<name>` — server-level decorator
- `request.aws.<name>` — request-level decorator (inside handlers)
- `server.plugins['@ar4mirez/hapi-aws'].aws.<name>` — plugin namespace

## Migrating from AWS SDK v2

```js
// Before (aws-sdk v2) — service name as string
services: [
  { name: 'codeCommit', service: 'CodeCommit' }
]

// After (aws-sdk v3) — pre-instantiated client
const { CodeCommitClient } = require('@aws-sdk/client-codecommit');
services: [
  { name: 'codeCommit', client: new CodeCommitClient({ region: 'us-east-1' }) }
]
```

> **Security note:** Never hardcode AWS credentials in your source code. Use environment variables (`AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY`) or IAM instance roles/task roles instead.

## License

ISC © [Angel Ramirez](https://github.com/ar4mirez)
