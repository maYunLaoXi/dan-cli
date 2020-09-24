const inquirer = require('inquirer')

const questions = [
  {
    type: 'input',
    name: 'name',
    message: '项目名称',
    default: 'dan-official-template'
  }
]

async function ask(nameObj) {
  let answers =  nameObj
  if(!nameObj) answers = await inquirer.prompt(questions)
  require('./generate')(answers)
}

module.exports = ask

