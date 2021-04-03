import nodeResolve from '@rollup/plugin-node-resolve'
import typescriptPlugin from '@rollup/plugin-typescript'
import vuePlugin from 'rollup-plugin-vue'
import replace from '@rollup/plugin-replace'
import sucrase from '@rollup/plugin-sucrase'
import babel from '@rollup/plugin-babel'
import pkg from './package.json'

const extensions = ['.js', '.jsx', '.ts', '.tsx'];
const name = 'ChatUI';

export default {
  input: './src/index.ts',
  output: {
    file: pkg.browser,
    format: 'umd',
    name,
    globals: {
      vue: 'Vue',
    },
    intro: `exports.version = '${pkg.version}';`,
  },
  plugins: [
    vuePlugin(),
    typescriptPlugin({
      sourceMap: true
    }),
    nodeResolve({
      extensions
    }),
    babel({
      extensions,
      include: ['src/**/*'],
      babelHelpers: 'runtime',
    }),
    sucrase({
      exclude: ['node_modules/**'],
      transforms: ['typescript'],
    }),
    replace({
      'process.env.NODE_ENV': `'production'`,
      preventAssignment: true
    })
  ],
}