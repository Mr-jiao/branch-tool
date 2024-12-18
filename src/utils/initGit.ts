const { simpleGit } = require('simple-git')
const { checkGit } = require('./check')

const initGit = async (vscode: any) => {
    // 获取默认工作区路径
    const filePath = vscode.workspace.workspaceFolders[0].uri.path

    let git = simpleGit(filePath, {
        binary: 'git',
    })

    const checkResult = await checkGit(git, vscode)
    if (!checkResult.valid) {
        return false
    }

    if (checkResult.filePath) {
        git = simpleGit(checkResult.filePath, {
            binary: 'git',
        })
    }

    return git
}

module.exports = initGit