const initGit = require('./utils/initGit')
const { v4: uuidv4 } = require('uuid')

interface BranchTypeOption {
    label: string,
    value: string,
}

interface YesOrNoOptions {
    label: string,
    value: boolean,
}

const BRANCH_TYPE_OPTIONS: BranchTypeOption[] = [
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

const YES_OR_NO_OPTIONS: YesOrNoOptions[] = [
    {
        label: '是',
        value: true,
    },
    {
        label: '否',
        value: false,
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
    const git = await initGit(vscode)
    if (!git) {
        return
    }

    let creatingBranchName = '' // 要创建的分支名
    const res: BranchTypeOption = await vscode.window.showQuickPick(BRANCH_TYPE_OPTIONS, {
        placeHolder: '请选择要创建的分支类型',
    })

    if (!res) {
        return
    }

    const branchType = res.value
    let isFromMaster = true // 是否基于 master 分支创建，版本分支和热修复分支强制基于 master 分支创建
    let baseBranch = 'master' // 基准分支

    if (['feature', 'bugfix', 'perf', 'refactor'].includes(branchType)) {
        const result = await vscode.window.showQuickPick(YES_OR_NO_OPTIONS, {
            placeHolder: '请选择是否基于 master 分支创建',
        })
        if (!result) {
            return
        }
        isFromMaster = result.value

        if (!isFromMaster) {
            try {
                vscode.window.setStatusBarMessage('同步远程仓库中...')
                await git.fetch(['-p'])
                vscode.window.setStatusBarMessage('')
            } catch (ex:any) {
                vscode.window.showInformationMessage(`同步远程仓库失败:${ex.message}`)
                vscode.window.setStatusBarMessage('')
                return
            }

            const remoteBranchResult = await git.branch(['-r'])
            const remoteBranches: string[] = remoteBranchResult.all.map((branchName: string) => {
                return branchName
            })
            baseBranch = await vscode.window.showQuickPick(remoteBranches, {
                placeHolder: '请选择要从哪个分支创建',
            })
            if (!baseBranch) {
                return
            }
            baseBranch = baseBranch.replace('origin/', '')
        }
    }

    if (branchType === 'release') {
        const versionNo = await vscode.window.showInputBox({
            placeHolder: '请输入版本号, 如: 1.0.0',
        })
        if (!versionNo) {
            return
        }
        const inputDate = await vscode.window.showInputBox({
            placeHolder: '请输入版本日期, 如: yyyymmdd',
        })
        if (!inputDate) {
            return
        }
        creatingBranchName = `${branchType}/v${versionNo}/${inputDate}/${getRandomString()}`
    }

    if (branchType !== 'release') {
        const inputName = await vscode.window.showInputBox({
            placeHolder: '请输入分支名称',
        })
        if (!inputName) {
            return
        }
        creatingBranchName = `${branchType}/${inputName}/${getDate()}/${getRandomString()}`
    }

    vscode.window.setStatusBarMessage('分支创建中...')

    const localBranch = await git.branchLocal()
    const currentBranch = localBranch.current

    if (currentBranch !== baseBranch) {
        try {
            await git.checkout(baseBranch)
        } catch (ex:any) {
            vscode.window.setStatusBarMessage('')
            vscode.window.showInformationMessage(`切换到${baseBranch}失败:${ex.message}`)
            return
        }
    }

    try {
        await git.pull(['origin', baseBranch])
    } catch (ex:any) {
        vscode.window.setStatusBarMessage('')
        vscode.window.showInformationMessage(`拉取${baseBranch}分支失败:${ex.message}`)
        return
    }

    try {
        await git.checkoutLocalBranch(creatingBranchName)
    } catch (ex:any) {
        vscode.window.showInformationMessage(`创建分支失败:${ex.message}`)
        return
    } finally {
        vscode.window.setStatusBarMessage('')
    }

    vscode.window.showInformationMessage('创建分支成功')
}

module.exports = handleCreate
