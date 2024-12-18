# heye-branch-tool

a tool for managing branches

## Features
- 开发分支创建
1. 使用本插件，无需通过命令行创建分支，可以通过指令面板创建分支

- 分支合并
1. 支持开发分支合并到test分支，防止出现反合test分支的情况（合并到test后，会自动同步远端）
2. 支持开发分支反合 master 分支

- 分支删除

## Usage
- 创建分支
1. 按住 `command+shift+p` 打开指令面板
2. 输入 `Create Branch` 创建分支；支持各种分支类型包括 开发分支、热修复分支、版本分支等

   相当与整合了开发分支的正常创建流程，如正常创建一个开发分支需要执行以下命令：

   ```bash
   git checkout master
   git pull
   git checkout -b feature/xxx

- 合并开发分支到test
1. 按住 `command+shift+p` 打开指令面板
2. 输入 `Merge To Test` 选择要合并到test的分支

- 反合 master
1. 按住 `command+shift+p` 打开指令面板
2. 输入 `Merge Master` 选择要反合 master 的分支

- 删除分支
1. 按住 `command+shift+p` 打开指令面板
2. 输入 `Delete Branch` 选择要删除的分支
