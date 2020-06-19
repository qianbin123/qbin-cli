/* eslint-disable import/no-dynamic-require */
//  (1)解析用户数据
const program = require('commander');
const path = require('path');
const { version } = require('./constants.js');

const mapAction = {
  create: {
    alias: 'c',
    description: 'create a project',
    examples: [
      'qbin-cli create <project-name>',
    ],
  },
  config: {
    alias: 'conf',
    description: 'config project variable',
    examples: [
      'qbin-cli config set <k> <v>',
      'qbin-cli config get <k>',
    ],
  },
  '*': {
    alias: '',
    description: 'command not found',
    examples: [],
  },
};

// Objects.keys 也行， 不过Reflect支持Symbol
Reflect.ownKeys(mapAction).forEach(action => {
  program
    .command(action) // 配置命令的名字
    .alias(mapAction[action].alias) // 命令的别名
    .description(mapAction[action].description) // 命令的描述
    .action(() => {
      if (action === '*') {
        // eslint-disable-next-line no-console
        console.log('无此命令');
      } else {
        // __dirname 表示当前执行文件夹
        // qbin-cli create xxx
        // 即process.argv [node, qbin-cli, create, xxxx]
        // eslint-disable-next-line global-require
        require(path.resolve(__dirname, action))(...process.argv.slice(3));
      }
    });
});

// 监听用户的help事件
program.on('--help', () => {
  console.log('\nExample:');
  // 将每个例子打印一边
  Reflect.ownKeys(mapAction).forEach((action) => {
    mapAction[action].examples.forEach((examples) => {
      // eslint-disable-next-line no-console
      console.log(`  ${examples}`);
    });
  });
});

// 解析用户传递过来的参数
program.version(version).parse(process.argv);
