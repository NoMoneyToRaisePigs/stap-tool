import resolve from '@rollup/plugin-node-resolve';
import terser from '@rollup/plugin-terser';
import serve from 'rollup-plugin-serve';
import livereload from 'rollup-plugin-livereload';

const isProduction = !process.env.ROLLUP_WATCH;

export default {
  input: 'src/root.js',
  output: [
    {
      file: 'dist/api-inspector.js',
      format: 'iife',
      name: 'ApiInspector',
      sourcemap: !isProduction
    },
    // {
    //   file: 'dist/api-inspector.esm.js',
    //   format: 'es',
    //   sourcemap: !isProduction
    // }
  ],
  plugins: [
    resolve(),
    
    // 只在生产环境压缩代码
    isProduction && terser(),
    
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