import {defineConfig} from '@remotion/renderer';

export default defineConfig({
  projectRoot: __dirname,
  outputName: 'output',
  webpackOverride: (config) => {
    // Enable TS support
    config.module?.rules?.push({
      test: /\.tsx?$/,
      use: [{loader: 'ts-loader'}],
    });
    return config;
  },
});
