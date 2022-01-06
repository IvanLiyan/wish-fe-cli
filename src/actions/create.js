const path = require("path");
const fs = require("fs");
const shell = require("shell");
const inquirer = require("inquirer");
const del = require("del");
const downloadRepo = require("download-git-repo");
const ora = require("ora");
const execa = require("execa");

/**
 * 判断路径目录是否存在，存在则调用inquirir 交互式命令 提示用户
 * @param {String} projectName 项目名称
 */

let spinner = null;

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
  const { createdir } = await inquirer.prompt([
    {
      name: "createdir",
      type: "confirm",
      message: "dir has exist, can you overwrite?", // 提示语
      default: true, // 默认值
    },
  ]);

  // 如果用户选择覆盖，则删除当前文件下所有内容 然后再创建，并返回新创建的目录
  if (createdir) {
    // 强制删除
    await del(newDir, { force: true });
    // 创建文件夹
    fs.mkdirSync(newDir);
    return newDir;
  } else {
    console.log("create dir has been cancle");
    // 以退出状态 1 指示 Node.js 同步地终止进程
    process.exit(1);
  }
};

const downloadTemplate = async (dir, projectName) => {
  const templates = ["vue-micro-wishpost-child", "vue-web"];

  const { template } = await inquirer.prompt([
    {
      name: "template",
      type: "list",
      message: "choose a template",
      choices: templates,
    },
  ]);
  console.log("select-template", template);

  const { stdout } = await execa(
    "npm",
    [
      "--registry=http://npm.bjs.i.wish.com",
      "--cache=$HOME/.npm",
      "--userconfig=$HOME/.npmrc",
      "whoami",
    ],
    { shell: true }
  );

  console.log("stdout", stdout);

  // 下载模板
  let downUrl = `ContextLogic/wish-fe-template#${template}`;
  console.log("url:", downUrl);

  // 下载模板并安装对应的依赖

  // 加载中的交互提示
  spinner = ora("download template...").start();
  // 要下载到的目录，这里我们以/temp目录为例
  const destinationDir = path.resolve(dir);
  console.log("destinationDir", destinationDir);
  // 执行下载模板
  downloadRepo(
    downUrl,
    destinationDir,
    {
      clone: true,
    },
    (err) => {
      console.log(err);
      spinner.succeed("download Success!");
      // 进入到下载到的文件夹
      // shell.cd(destinationDir);

      // spinner.text = "install depends...";
      // spinner.start();
      // 安装依赖
      // shell.exec("npm install");
      spinner.succeed();
    }
  );
};

module.exports = async (projectName) => {
  // 创建目录 如果存在提示用户是否覆盖
  const dir = await existDir(projectName);
  downloadTemplate(dir, projectName);
};
