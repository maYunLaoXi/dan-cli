const path = require('path')
const ora = require('ora')
const download = require('download-git-repo')
const fse = require('fs-extra')
const chalk = require('chalk')
const memFs = require('mem-fs')
const memFsEditor = require('mem-fs-editor')
const shell = require('shelljs')
const { TEMPLATE_GIT_REPO, INJECT_FILES } = require('./constants')
const { getDirFileName, install } = require('./utils')


async function generate({name = 'dan-official-starter', description = ''}) {
  // 安装依赖的命令
  const installCommand = await install()

  const projectPath = path.join(process.cwd(), name)
  console.log(projectPath)
  const downloadPath = path.join(projectPath, '__download__')
  console.log(projectPath, downloadPath)
  const downloadSpinner = ora('正在下载模板，请稍等...')

  downloadSpinner.start()

  download(TEMPLATE_GIT_REPO, downloadPath, { clone: true }, err => {
    if(err) {
      downloadSpinner.color = 'red'
      downloadSpinner.fail(err.message)
      return
    }
    downloadSpinner.color = 'green';
    downloadSpinner.succeed('✔ success');

    const copyFiles = getDirFileName(downloadPath)
    copyFiles.forEach((file) => {
      fse.copySync(path.join(downloadPath, file), path.join(projectPath, file))
      console.log(`${chalk.green('✔ ')}${chalk.grey(`创建: ${name}/${file}`)}`)
    })
    const file = INJECT_FILES[0]
    editFile(path.join(downloadPath, file), path.join(name, file), { name, description}).then( async res => {
      console.log(`${chalk.green('✔ ')}${chalk.grey(`创建: ${name}/${file}`)}`)
      fse.remove(downloadPath)
      process.chdir(projectPath)

      // gitInit(projectPath)

      // 安装项目依赖
      const command = installCommand === 'yarn' ? 'yarn' : `${installCommand} install`
      const installSpinner = ora(`安装项目依赖 ${chalk.green.bold(command)}, 请稍后...`)
      installSpinner.start()

      shell.exec(command, function(code, stdout, stderr) {
        console.log({ code, stdout, stdout })
        installSpinner.succeed('success');
      })
    })
  })
  
}
function editFile(source, dest, data) {
  const store = memFs.create();
  const editor = memFsEditor.create(store)
  editor.copyTpl(source, dest, data)
  return new Promise(resolve => {
    editor.commit((res) => {
      resolve()
    })
  })
}
function gitInit(projectPath) {
  shell.exec('git init')
}
module.exports = generate