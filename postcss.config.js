export default {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
    "postcss-pxtorem": { // 此处为添加部分
        rootValue: 37.5, // 对应16px 适配移动端750px宽度
        unitPrecision: 5,
        propList: ['*'],
        selectorBlackList: [],// 忽略转换正则匹配项
        replace: true,
        mediaQuery: false,
        minPixelValue: 0
      }
  },
}
