const path = require("path");
const fs = require("fs");
const shell = require("shelljs");
const chalk = require("chalk");
const del = require("del");
const ora = require("ora");
const inquirer = require("inquirer");
var EventEmitter = require("events");

const downloadRepo = require("download-git-repo");
const step = (msg) => console.log(chalk.cyan(msg));
const success = (msg) => console.log(chalk.green(msg));
const warning = (msg) => console.log(chalk.yellow(msg));
const error = (msg) => console.log(chalk.red(msg));

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
      message: "Dir has exist, do you overwrite it?", // 提示语
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
    warning("\ncreate dir has been canceled");

    // 以退出状态 1 指示 Node.js 同步地终止进程
    process.exit(1);
  }
};

/**
 * 是否自动安装依赖，存在则调用inquirir 交互式命令 提示用户
 * @param {String} dir 项目路径
 */
const install = async (dir, projectName) => {
  const destinationDir = path.resolve(dir);
  // 是否安装依赖
  const { install } = await inquirer.prompt([
    {
      name: "install",
      type: "confirm",
      message: "Do you want auto install porject dependences ", // 提示语
      default: true, // 默认值
    },
  ]);
  if (install) {
    // 进入到下载到的文件夹;
    shell.cd(destinationDir);
    // 安装依赖
    var child = shell.exec("npm install", { async: true });

    child.stdout.on("close", function (data) {
      spinner.text = "Install dependences success";
      spinner.succeed();
      success(`Successfully created project ${projectName}`);
    });
  } else {
    success(`Successfully created project ${projectName}`);
  }
};

/**
 * 调用inquirir 交互式命令 提示用户选择下载项目模版，并进行模版的下载
 * @param {String} dir 项目路径
 */
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

  step(`\nSelect-template: ${template}`);

  // 下载模板并安装对应的依赖
  let downUrl = `ContextLogic/wish-fe-template#${template}`;

  // 加载中的交互提示
  spinner = ora("Initial project...").start();
  // 要下载到的目录，这里我们以/temp目录为例
  const destinationDir = path.resolve(dir);

  // 执行下载模板
  downloadRepo(
    downUrl,
    destinationDir,
    {
      clone: true,
    },
    (err) => {
      if (err) {
        error(`\nDownload template error:`);
        console.log(err);
        process.exit(1);
      } else {
        spinner.text = "Download template success~";
        spinner.succeed();
        install(dir, projectName);
      }
    }
  );
};

module.exports = async (projectName) => {
  // 创建目录 如果存在提示用户是否覆盖
  const dir = await existDir(projectName);
  await downloadTemplate(dir, projectName);
};
