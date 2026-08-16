import commonjs from '@rollup/plugin-commonjs';
import multi from '@rollup/plugin-multi-entry';
import resolve from '@rollup/plugin-node-resolve';
import copy from 'rollup-plugin-copy';
import filesize from 'rollup-plugin-filesize';
import { terser } from "rollup-plugin-terser";
import { loadJsonFileSync } from 'load-json-file'
import rollupBanner from '@jswork/rollup-banner';

const pkg = loadJsonFileSync('./package.json');


const installCfg = {
  targets: [{
    src: 'src/install.js',
    dest: 'dist',
    transform: (contents) => contents.toString().replace(/__VERSION__/g, pkg.version)
  }]
};

export default {
  input: 'src/plugins/*.js',
  output: {
    strict: false,
    file: 'dist/index.js',
    format: 'umd',
    banner: rollupBanner()
  },
  plugins: [
    resolve(),
    commonjs(),
    multi(),
    terser({ output: { comments: true } }),
    copy(installCfg),
    filesize()
  ]
};
