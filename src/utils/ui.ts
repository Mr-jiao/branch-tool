const vscode = require('vscode')

const statusBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left, 100)

const showLoading = (text: string = 'Loading') => {
    statusBarItem.text = `$(sync~spin) ${text}`
    statusBarItem.show()
}

// 隐藏 loading 效果的函数
const hideLoading = () => {
    statusBarItem.hide()
}

module.exports = {
    showLoading,
    hideLoading,
}