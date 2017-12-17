'use strict'

const lastsContests = process.argv.slice(2)
const chalk = require('chalk')
const request = require('request')
const ApiUtil = require('./utils/api.util')
const Columns = require('./utils/column.util')
const _ = require('lodash')
const Raffle = require('./raffle')
const childProcess = require('child_process')
const fs = require('fs')

let numbers = _.range(1, 61);
const maxNumbers = 6
let filledColumns = []
let emptyColumns = []

if (lastsContests.length === 0) {
  console.log(chalk.red('Você precisa informar o número do último concurso!'))
  process.exit(1)
}

const columns = [Columns.first, Columns.second, Columns.third, Columns.fourth, 
                Columns.fifth, Columns.sixth, Columns.seventh, Columns.eighth,
                Columns.ninth, Columns.tenth]

ApiUtil.getLastEighteenOrSeventeenNumbers(lastsContests[0])
  .then(lastEightNumbers => {
    
    numbers = numbers.filter((item, index, array) => {
      return !lastEightNumbers.includes(item)
    })

    ApiUtil.getLastNumbers(lastsContests[0])
      .then(lastNumbers => {

        columns.forEach(column => {
          lastNumbers.forEach(n => {
            column.forEach(number => {
              if (n === number) {
                filledColumns.push(column)
              }
            })
          })
        })

        filledColumns = filledColumns.filter((item, index, array) => {
          return _.isEqual(array.indexOf(item), index) 
        })

        columns.sort((a, b) => a - b)
        filledColumns.sort((a, b) => a - b)

        emptyColumns = columns.filter((item, index, array) => {
          return !filledColumns.includes(item)
        })

        Raffle.make(numbers, emptyColumns)
          .then(numbers => {
            numbers.sort((a, b) => a - b)
            console.log(chalk.green('Jogo final sugerido: ' + numbers))
            fs.appendFile('results.txt', `\n${numbers}`, (err) => {
              if (err) console.log(err)
              console.log(chalk.green('Salvo no arquivo!'))
            })
            fs.readFile('results.txt', 'utf-8', (err, data) => {
              if (err) console.log(err)
              const firstLine = data.split('\n')[0]
              if (firstLine < 10) {
                fs.writeFileSync('results.txt', data.replace(firstLine, parseInt(firstLine) + 1))
                childProcess.fork(`./index.js`, [lastsContests[0]])
              }
            })
          }).catch(error => {
            console.log(chalk.red(error))
            childProcess.fork(`./index.js`, [lastsContests[0]])
          })

      })
  })


