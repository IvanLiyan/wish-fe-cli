const path = require("path");
const fs = require("fs");
const inquirer = require("inquirer");
const del = require("del");

/**
 * 判断路径目录是否存在，存在则调用inquirir 交互式命令 提示用户
 * @param {String} projectName 项目名称
 */
const existDir = async (projectName) => {
  // 获取当前路径
  const curDir = path.resolve("./");
  // 获取全路径
  const newDir = path.resolve(curDir, `./${projectName}`);
  // console.log('newDir', newDir)；

  // 判断目录是否已经存在，如果不存在目录直接创建，并返回创建目录路径
  if (!fs.existsSync(newDir)) {
    fs.mkdirSync(newDir);
    return newDir;
  }
  // 如果已存在，使用inquirer 提示用户是否覆盖，返回一个boolean值
  const res = await inquirer.prompt([
    {
      name: "createdir",
      type: "confirm",
      message: "dir has exist, can you overwrite?", // 提示语
      default: true, // 默认值
    },
  ]);
  // 如果用户选择覆盖，则删除当前文件下所有内容 然后再创建，并返回新创建的目录
  if (res) {
    // 强制删除
    // await del(newDir, { force: true });
    // // 创建文件夹
    // fs.mkdirSync(newDir);
    // return newDir;
    console.log(" dir has been exited");
  } else {
    console.log("create dir has been cancle");
    // 以退出状态 1 指示 Node.js 同步地终止进程
    process.exit(1);
  }
};

module.exports = async (projectName) => {
  // 创建目录 如果存在提示用户是否覆盖
  const dir = await existDir(projectName);
  console.log("dir", dir);
};
