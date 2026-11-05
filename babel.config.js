module.exports = {
  presets: [
    [
      '@vue/cli-plugin-babel/preset',
      {
        useBuiltIns: 'entry', // 按需引入 polyfill
        corejs: 3, // 使用 core-js 3 来提供更全面的 polyfill
      }
    ]
  ],
  env: {
    development: {
      // babel-plugin-dynamic-import-node plugin 仅将所有的 import() 转换为 require()
      plugins: ['dynamic-import-node']
    }
  }
}
