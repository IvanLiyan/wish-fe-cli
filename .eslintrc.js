module.exports = {
  root: true,
  env: {
    node: true,
  },
  extends: ['plugin:vue/essential', 'eslint:recommended', '@vue/prettier'],
  parserOptions: {
    ecmaVersion: 2020,
  },
  rules: {
    // 0 禁用此规则 1 不符合规则即给出警告 2 不符合规则即报错
    'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off', // 生产环境不使用console
    'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off', // 生产环境不使用debugger
    indent: ['error', 2], // 2空格缩进
    semi: ['error', 'always'], // 添加分号
    'max-len': [2, 180, 2], // 行最大长度为180
    'arrow-spacing': [2, { before: true, after: true }], // 强制箭头函数的箭头前后使用一致的空格
    'prefer-const': 2, // 要求使用 const 声明那些声明后不再被修改的变量
    'comma-spacing': [2, { before: false, after: true }], // 控制逗号前后的空格
    'comma-dangle': ['error', 'always-multiline'], // 多行最后一个属性加逗号
    'comma-style': [2, 'last'], // 控制逗号在行尾出现
    'key-spacing': [2, { beforeColon: false, afterColon: true }], // 对象字面量中冒号添加后空格
    'object-curly-spacing': [2, 'always', { objectsInObjects: false }], // 大括号内是否允许不必要的空格
    'array-bracket-spacing': [2, 'never'], // 不允许非空数组里面有多余的空格
    'spaced-comment': [2, 'always', { markers: ['global', 'globals', 'eslint', 'eslint-disable', '*package', '!', ','] }], // 注释风格需要有空格
    // 属性一行最多5个，多行每行最多1个
    'vue/max-attributes-per-line': [
      'error',
      {
        singleline: { max: 5 },
        multiline: {
          max: 1,
        },
      },
    ],
    'vue/order-in-components': 2, // vue属性按照指定顺序进行排列
    'vue/no-parsing-error': [2, { 'x-invalid-end-tag': false }], // 关闭无效结尾标签的错误
    'vue/no-use-v-if-with-v-for': 0, // 允许v-for 和 v-if 作用在同一元素上
    'vue/no-unused-components': [
      'error',
      {
        ignoreWhenBindingPresent: true,
      },
    ], // 禁止未使用的components
    'prettier/prettier': [
      // 保存文件自动根据以下规则进行prettier格式化
      'error',
      {
        semi: true, // 语句的末尾加上分号
        useTabs: false, // 行缩进使用 tab 键代替空格
        tabWidth: 2, // （默认值）一个 tab 键缩进相当于 2 个空格
        singleQuote: true, // 使用单引号
        quoteProps: 'as-needed', // （默认值）仅仅当必须的时候才会加上双引号
        arrowParens: 'avoid', // 当箭头函数中只有一个参数的时候可以忽略括弧
        trailingComma: 'all', // 不用在多行的逗号分隔的句法结构的最后一行的末尾加上逗号
        bracketSpacing: true, // （默认值）在括号和对象的文字之间加上一个空格
        eslintIntegration: true, // 让prettier使用eslint的代码格式进行校验
        jsxBracketSameLine: false, // 不把 > 符号放在多行的 JSX 元素的最后一行
        htmlWhitespaceSensitivity: 'ignore', // vue template 中的结束标签结尾尖括号掉到了下一行
        printWidth: 180, // 单行代码超出 180 个字符自动换行
        proseWrap: 'preserve', // 根据长度换行
        vueIndentScriptAndStyle: false, // （默认值）对于 .vue 文件，不缩进 <script> 和 <style> 里的内容
        embeddedLanguageFormatting: 'auto', // （默认值）允许自动格式化内嵌的代码块
      },
    ],
  },
};
