const axios = require('axios');
const ora = require('ora');
const inquirer = require('inquirer');
const chalk = require('chalk');

/* create 命令下的所有逻辑（create 功能是创建项目）
 * 1、拉取你自己的项目列出来，让用户选安装哪个项目，projectName
 * 2、选完后显示所有的版本号
 * 3、可能还需要用户配置一些数据，来结合渲染项目
 * 
 *  https://api.github.com/users/qianbin123/repos 获取组织下的仓库
 */

// 获取项目列表
const fetchRepoList = async() => {
  const { data } = await axios.get('https://api.github.com/users/qianbin123/repos');
  return data;
};

module.exports = async (projectName) => {
  // 获取项目的模版
  const str = chalk.red('fetching template ...');
  const spinner = ora(str);
  spinner.start();
  let repos = await fetchRepoList();
  spinner.succeed();
  repos = repos.map((item) => item.name);
  // 在获取之前，显示loading，关闭loading
  // 选择插件 inquirer
  const { repo } = await inquirer.prompt({
    name: 'repo', // 获取选择后的结果
    type: 'list',
    message: '请创建一个项目',
    choices: repos,
  });
  console.log(repo);
};
