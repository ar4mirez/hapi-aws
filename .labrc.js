'use strict';

// AWS SDK v3 injects TypeScript transpilation helpers into the global scope.
// These are not leaks from our code — list them here so lab's leak detector ignores them.
const AWS_SDK_GLOBALS = [
    'awslambda',
    '__extends',
    '__assign',
    '__rest',
    '__decorate',
    '__param',
    '__esDecorate',
    '__runInitializers',
    '__propKey',
    '__setFunctionName',
    '__metadata',
    '__awaiter',
    '__generator',
    '__exportStar',
    '__createBinding',
    '__values',
    '__read',
    '__spread',
    '__spreadArrays',
    '__spreadArray',
    '__await',
    '__asyncGenerator',
    '__asyncDelegator',
    '__asyncValues',
    '__makeTemplateObject',
    '__importStar',
    '__importDefault',
    '__classPrivateFieldGet',
    '__classPrivateFieldSet',
    '__classPrivateFieldIn',
    '__addDisposableResource',
    '__disposeResources',
    '__rewriteRelativeImportExtension'
].join(',');

module.exports = {
    globals: AWS_SDK_GLOBALS
};
