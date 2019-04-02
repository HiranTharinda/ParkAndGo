"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tsNode = require("ts-node");
var serverAddress = 'http://localhost:4723/wd/hub';
var testFilePAtterns = [
    '**/*/*.e2e-spec.ts'
];
var androidPixel2XLCapability = {
    browserName: '',
    autoWebview: true,
    autoWebviewTimeout: 20000,
    platformName: 'Android',
    deviceName: 'pixel2xl',
    app: './platforms/android/app/build/outputs/apk/debug/app-debug.apk',
    'app-package': 'io.ionic.parkandgo',
    'app-activity': 'MainActivity',
    nativeWebTap: 'true',
    autoAcceptAlerts: 'true',
    autoGrantPermissions: 'true',
    newCommandTimeout: 300000
};
exports.config = {
    allScriptsTimeout: 11000,
    specs: testFilePAtterns,
    baseUrl: '',
    multiCapabilities: [
        androidPixel2XLCapability
    ],
    framework: 'jasmine',
    jasmineNodeOpts: {
        showColors: true,
        defaultTimeoutInterval: 30000
    },
    seleniumAddress: serverAddress,
    onPrepare: function () {
        tsNode.register({
            project: 'e2e/tsconfig.json'
        });
    }
};
//# sourceMappingURL=protractor.config.js.map