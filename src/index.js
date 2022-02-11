const path = require("path");
const { program } = require("commander");

// 定义命令参数对象
const actions = {
  // create命令
  creation: {
    alias: "create",
    desc: "create a project",
  },
  // 删除命令
  delete: {
    alias: "del",
    desc: "delete a file form path",
  },
  // 提示命令
  help: {
    alias: "del",
    desc: "delete a file form path",
  },
  // 其他的命令处理
  "*": {
    alias: "",
    desc: "command not found",
  },
};

// 遍历actions配置命令
Object.keys(actions).forEach((key) => {
  program
    .command(key) // 定义命令字段
    .alias(actions[key].alias) // 定义别名delete => del
    .description(actions[key].desc) // 定义描述
    // 命令方法处理
    .action((source, destination) => {
      if (key === "*") {
        console.log(actions[key].desc);
      } else {
        // creation.js和delete.js传递参数
        require(path.resolve(__dirname, `./actions/${key}`))(
          // 对应actions文件夹下的名称
          process.argv.slice(3)
        ); // 取第四个参数之后的参数
      }
    });
});

program.parse(process.argv);
