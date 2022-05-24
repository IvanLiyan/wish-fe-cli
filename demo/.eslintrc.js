module.exports = {
  root: true,
  env: {
    node: true,
    jquery: true,
  },
  globals: { _: true, window: true },
  extends: ['plugin:vue/essential', 'eslint:recommended', '@vue/prettier'],
  parserOptions: {
    ecmaVersion: 2020,
  },
  rules: {
    // 0 禁用此规则 1 不符合规则即给出警告 2 不符合规则即报错
    'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off', // 生产环境不使用console
    'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off', // 生产环境不使用debugger
    'no-multiple-empty-lines': [
      2,
      {
        max: 0,
      },
    ], //不能有多余空行
    indent: ['error', 2, { SwitchCase: 1, FunctionDeclaration: { body: 1, parameters: 2 } }], // 2空格缩进
    semi: ['error', 'always'], // 添加分号
    'vue/max-len': [
      'error',
      {
        code: 120, // 行最大长度为120
        template: 120,
        tabWidth: 2, // 字符宽度
        ignoreStrings: true, // 忽略包含双引号或单引号字符串的行
        ignoreTemplateLiterals: true, // 忽略包含模板文字的行
        ignoreRegExpLiterals: true, // 忽略包含 RegExp 文字的行
        ignoreUrls: true, // 忽略包含 URL 的行
        ignoreComments: true, // 忽略他们自己的行中的所有尾随评论和评论
        ignoreRegExpLiterals: true, // 忽略包含 RegExp 文字的行
        ignoreHTMLAttributeValues: true, // 忽略HTML属性值
        ignoreHTMLTextContents: true, // 忽略HTML文本内容
      },
    ], // 行最大长度为120
    'arrow-spacing': [2, { before: true, after: true }], // 强制箭头函数的箭头前后使用一致的空格
    'prefer-const': 2, // 要求使用 const 声明那些声明后不再被修改的变量
    'comma-spacing': [2, { before: false, after: true }], // 控制逗号前后的空格
    'comma-dangle': ['error', 'always-multiline'], // 多行最后一个属性加逗号
    'comma-style': [2, 'last'], // 控制逗号在行尾出现
    'key-spacing': [2, { beforeColon: false, afterColon: true }], // 对象字面量中冒号添加后空格
    'object-curly-spacing': [2, 'always', { objectsInObjects: true }], // 大括号内是否允许不必要的空格
    'array-bracket-spacing': [2, 'never'], // 不允许非空数组里面有多余的空格
    'spaced-comment': [
      2,
      'always',
      {
        markers: ['global', 'globals', 'eslint', 'eslint-disable', '*package', '!', ','],
      },
    ], // 注释风格需要有空格
    // 属性一行最多5个，多行每行最多1个
    // 'vue/max-attributes-per-line': [
    //   'error',
    //   {
    //     singleline: { max: 20 },
    //     multiline: {
    //       max: 1,
    //     },
    //   },
    // ],
    'vue/order-in-components': 2, // vue属性按照指定顺序进行排列
    'vue/no-parsing-error': [2, { 'x-invalid-end-tag': false }], // 关闭无效结尾标签的错误
    'vue/no-use-v-if-with-v-for': 0, // 允许v-for 和 v-if 作用在同一元素上
    'vue/no-unused-components': [
      'error',
      {
        ignoreWhenBindingPresent: true,
      },
    ], // 禁止未使用的components
    'vue/component-name-in-template-casing': [
      // 组件在模版中使用kebab-case风格
      'error',
      'kebab-case',
      {
        registeredComponentsOnly: true,
        ignores: [],
      },
    ],
    // 设置引入组件命名，但需eslint-plugin-vue v8.2.0才生效
  },
};
