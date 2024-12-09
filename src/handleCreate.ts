const { simpleGit } = require('simple-git')
const { v4: uuidv4 } = require('uuid')

interface BranchItem {
    label: string,
    value: string,
}

const CREATE_BRANCH_OPTIONS: BranchItem[] = [
    {
        label: '开发分支',
        value: 'feature'
    },
    {
        label: '热修复分支',
        value: 'hotfix',
    },
    {
        label: '修复分支',
        value: 'bugfix',
    },
    {
        label: '优化分支',
        value: 'perf',
    },
    {
        label: '版本分支',
        value: 'release',
    },
    {
        label: '重构分支',
        value: 'refactor',
    },
]

const getDate = () => {
    const now = new Date()
    const year = now.getFullYear()
    let month: number | string = now.getMonth() + 1
    let day: number | string = now.getDate()
    month = month < 10 ? `0${month}` : month
    day = day < 10 ? `0${day}` : day
    return `${year}-${month}-${day}`
}

const getRandomString = () => {
    return uuidv4().slice(0, 8)
}

const handleCreate = async (vscode: any) => {
    // 获取工作区路径
    const filePath = vscode.workspace.workspaceFolders[0].uri.path
    // console.log('filePath', filePath)

    const git = simpleGit(filePath, {
        binary: 'git',
    })

    const res: BranchItem = await vscode.window.showQuickPick(CREATE_BRANCH_OPTIONS, {
        placeHolder: '请选择要创建的分支类型',
    })

    const inputName = await vscode.window.showInputBox({
        placeHolder: '请输入分支名称',
    })

    const localBranch = await git.branchLocal()
    console.log('localBranch', localBranch)

    const creatingBranchName = `${res.value}/${inputName}/${getDate()}/${getRandomString()}`
    console.log('creatingBranchName', creatingBranchName)

    const currentBranch = localBranch.current
    console.log('currentBranch', currentBranch)
    if (currentBranch !== 'master') {
        try {
            await git.checkout('master')
        } catch (ex) {
            console.log(ex)
            vscode.window.showInformationMessage('切换到master失败')
            return
        }
    }

    try {
        await git.pull()
    } catch (ex) {
        console.log(ex)
        vscode.window.showInformationMessage('拉取master分支失败')
        return
    }

    try {
        await git.checkoutLocalBranch(creatingBranchName)
    } catch (ex) {
        console.log(ex)
        vscode.window.showInformationMessage('创建分支失败')
        return
    }

    vscode.window.showInformationMessage('创建分支成功')
}

module.exports = handleCreate
