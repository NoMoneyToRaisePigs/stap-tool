import resolve from '@rollup/plugin-node-resolve';
import terser from '@rollup/plugin-terser';
import serve from 'rollup-plugin-serve';
import livereload from 'rollup-plugin-livereload';
import alias from '@rollup/plugin-alias'
import replace from '@rollup/plugin-replace'

import path from 'node:path'
import { fileURLToPath } from 'node:url'
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const isProduction = !process.env.ROLLUP_WATCH;

export default {
  input: 'src/root.js',
  output: [
    {
      file: 'dist/api-inspector.js',
      format: 'iife',
      name: 'ApiInspector',
      sourcemap: true
    },
    // {
    //   file: 'dist/api-inspector.esm.js',
    //   format: 'es',
    //   sourcemap: !isProduction
    // }
  ],
  plugins: [
    resolve(),
    alias({
      entries: [
        { find: '@', replacement: path.resolve(__dirname, 'src') },
      ]
    }),

    replace({
      preventAssignment: true, // 必须加！否则变量替换可能会出 bug
      'process.env.NODE_ENV': JSON.stringify(isProduction ? 'prod' : 'env'),
      __APP_VERSION__: JSON.stringify('1.0.0') // 你也可以自定义变量
    }),
    
    // 只在生产环境压缩代码
    isProduction && terser({
      sourceMap: true
    }),
    
    // 开发服务器 - 仅在开发模式启用
    !isProduction && serve({
      open: true,
      contentBase: ['dist', 'public'],
      host: 'localhost',
      port: 3000
    }),
    
    // 热重载 - 仅在开发模式启用
    !isProduction && livereload({
      watch: 'dist'
    })
  ]
};