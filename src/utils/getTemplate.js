// import ora from "ora";
// import shell from "shell";
// import downloadRepo from "download-git-repo";
// import inquirer from "inquirer";

const shell = require("shell");
const path = require("path");
const ora = require("ora");
const downloadRepo = require("download-git-repo");
const inquirer = require("inquirer");

// const {
//     chalk,
//     execa,

//     log,
//     warn,
//     error,
//   } = require('@vue/cli-shared-utils')

// ......添加获取仓库及tag逻辑
// 定义github api请求路径
// const baseGitApi = "https://api.github.com";
// 定义加载进度条对象
let spinner = null;
// 获取仓库列表 返回对应的仓库数组
// const getReposList = async () => {
//   // 加载的进度显示
//   spinner = ora("Loading repos...").start();
//   // 获取仓库列表
//   const { data } = await axios.get(`${baseGitApi}/users/hew007/repos`);
//   spinner.succeed("Loading Success!");
//   // 获取符合条件的仓库名 由于这里模板仓库都是使用的-tpl后缀，所以可以筛选
//   const reposNames = data
//     .map((ele) => ele.name)
//     .filter((item) => /tpl/.test(item));
//   return reposNames;
// };

// 根据仓库 获取tag列表
// const getReposTags = async (repo) => {
//   // 加载的友好进度条
//   spinner.text = "Loading tags...";
//   spinner.start();
//   // 获取tags
//   const { data } = await axios.get(
//     `${baseGitApi}/repos/ContextLogic/wish-fe-template/tags`
//   );
//   // 加载成功显示
//   spinner.succeed("Loading Success!");
//   // 获取符合条件的仓库名
//   const reposTags = data.map((ele) => ele.name);
//   // 返回tags数组;
//   return reposTags;
// };

module.exports = async (projectName) => {
  // 创建目录 如果存在提示用户是否覆盖
  //   const dir = await existDir(projectName);

  // 拉去github templete 选择指定的tag和仓库
  //   const repos = await getReposList();
  //   console.log("repos:", repos);
  // 获取用户选择的仓库repo
  //   const { repo } = await inquirer.prompt([
  //     {
  //       name: "repo",
  //       type: "list",
  //       message: "choose a repo",
  //       choices: repos,
  //     },
  //   ]);

  // 获取用户选择的tag
  //   console.log("repo", repo);
  // 获取tags
  //   const tags = await getReposTags(repo);
  // 让用户选择使用哪一个版本的tag

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

  // 下载模板
  let downUrl = `ContextLogic/wish-fe-template/${template}`;

  console.log("url:", downUrl);

  // 下载模板并安装对应的依赖

  // 加载中的交互提示
  spinner = ora("download template...").start();
  // 要下载到的目录，这里我们以/temp目录为例
  const destinationDir = path.resolve(dir, "./temp");
  console.log("destinationDir", destinationDir);
  // 执行下载模板
  downloadRepo(downUrl, destinationDir, (err) => {
    spinner.succeed("download Success!");
    // 进入到下载到的文件夹
    shell.cd(destinationDir);

    spinner.text = "install depends...";
    spinner.start();
    // 安装依赖
    // shell.exec("npm install");
    spinner.succeed();
  });
};
