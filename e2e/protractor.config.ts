import {Config} from 'protractor';
import * as tsNode from 'ts-node';

const serverAddress = 'http://localhost:4723/wd/hub';
const testFilePAtterns: Array<string> = [
  '**/*/*.e2e-spec.ts'
];
const androidPixel2XLCapability = {
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

export let config: Config = {
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
  onPrepare: () => {
    tsNode.register({
      project: 'e2e/tsconfig.json'
    });
  }
};
