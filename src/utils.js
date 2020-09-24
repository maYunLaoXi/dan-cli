const path = require('path');
const fse = require('fs-extra');
const inquirer = require('inquirer')
const shell = require('shelljs')

const { INJECT_FILES } = require('./constants');
const ask = require('./init');

function getRootPath() {
  return path.resolve(__dirname, './..');
}

function getPackageVersion() {
  const version = require(path.join(getRootPath(), 'package.json')).version;
  return version;
}
exports.getPackageVersion = getPackageVersion

function logPackageVersion() {
  const msg = `dan-cli version: ${getPackageVersion()}`;
  console.log();
  console.log(msg);
  console.log();
}
exports.logPackageVersion = logPackageVersion;

function getDirFileName(dir) {
  try {
    const files = fse.readdirSync(dir);
    const filesToCopy = [];
    files.forEach((file) => {
      if (file.indexOf(INJECT_FILES) > -1) return;
      filesToCopy.push(file);
    });
    return filesToCopy;
  } catch (e) {
    return [];
  }
}
exports.getDirFileName = getDirFileName;

exports.install = async function() {
  const command = ['yarn', 'cnpm']
  let method = 'npm'
  for(let com of command) {
    const res = await chooseMethod(com)
    if(res){
      method = com
      break
    }
  }
  return method
}
async function chooseMethod(question) {
  const ask = {
    type: 'confirm',
    name: 'use',
    message: `使用${question}安装吗？`
  }
  const answer =  await inquirer.prompt([ask])
  return answer.use
}