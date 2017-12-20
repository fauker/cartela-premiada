'use strict'

const randy = require('randy')
const _ = require('lodash')
const chalk = require('chalk')

const Rows = require('./utils/row.util')
const Columns = require('./utils/column.util')
const Quadrants = require('./utils/quadrant.util')
const Diagonals = require('./utils/diagonals.util')

const rows = [Rows.first, Rows.second, Rows.third, Rows.fourth, Rows.fifth, Rows.sixty]
const columns = [Columns.first, Columns.second, Columns.third, Columns.fourth, 
                Columns.fifth, Columns.sixth, Columns.seventh, Columns.eighth,
                Columns.ninth, Columns.tenth]
const quadrants = [Quadrants.first, Quadrants. second, Quadrants.third, Quadrants.fourth]
const diagonals = [Diagonals.first, Diagonals.second, Diagonals.third, Diagonals.fourth, Diagonals.fifth,
                  Diagonals.sixth, Diagonals.seventh, Diagonals.eighth, Diagonals.ninth, Diagonals.tenth,
                  Diagonals.eleventh, Diagonals.twelfth, Diagonals.thirteenth, Diagonals.fourteenth,
                  Diagonals.fifteenth, Diagonals.sixteenth, Diagonals.seventeenth, Diagonals.eighteenth,
                  Diagonals.nineteenth, Diagonals.twentieth, Diagonals.twenty_first, Diagonals.twenty_second]

class Raffle {

  static make (numbers, emptyColumns) {
    return new Promise((resolve, reject) => {
      const originalEmptyColumns = emptyColumns

      // remove 2 random columns 
      emptyColumns.splice(Math.floor(Math.random() * emptyColumns.length), 1)
      emptyColumns.splice(Math.floor(Math.random() * emptyColumns.length), 1)
      
      const numberRowToRemove = Math.floor(Math.random() * 2) + 1
      let emptyRows = []
      if (numberRowToRemove === 1) {
        emptyRows = rows.splice(Math.floor(Math.random() * 6), 1)[0]
      } else if (numberRowToRemove === 2) {
        emptyRows = rows.splice(Math.floor(Math.random() * 6), 1)[0]
        emptyRows = emptyRows.concat(rows.splice(Math.floor(Math.random() * 5), 1)[0])
      }

      let finalNumbers = []
      let mergedEmptyColumnsArrays = [].concat.apply([], emptyColumns);
      finalNumbers = _.difference(numbers, mergedEmptyColumnsArrays)
      finalNumbers = _.difference(numbers, emptyRows)
      finalNumbers = randy.best.sample(finalNumbers, 6)

      if (Raffle._checkThreeNumbersInSameRow(finalNumbers)) {
        console.log(chalk.red(finalNumbers))
        reject('3 números ou mais na mesma fileira/linha! Roda novamente!')
      } else if (Raffle._checkThreeNumbersInSameColumn(finalNumbers)) {
        console.log(chalk.red(finalNumbers))
        reject('3 números ou mais na mesma coluna! Roda novamente!')
      } else if (Raffle._checkThreeNumbersInSameQuadrant(finalNumbers)) {
        console.log(chalk.red(finalNumbers))
        reject('3 números ou mais no mesmo quadrante! Roda novamente!')
      } else if (Raffle._checkThreeNumbersInSameDiagonal(finalNumbers)) {
        console.log(chalk.red(finalNumbers))
        reject('3 números ou mais na mesma diagonal! Roda novamente!')
      } else if (Raffle._checkColumns(finalNumbers)) {
        console.log(chalk.red(finalNumbers))
        reject('O jogo não está em 4 ou 5 colunas!')
      }
        
      resolve(finalNumbers)
    })
  }

  static _checkThreeNumbersInSameRow (finalNumbers) {
    let result = false
    rows.forEach(row => {
      const intersections = finalNumbers.filter(f => row.indexOf(f) !== -1)
      if (intersections.length >= 3) {
        result = true
        return
      }
    })
    return result 
  }

  static _checkThreeNumbersInSameColumn (finalNumbers) {
    let result = false
    columns.forEach(column => {
      const intersections = finalNumbers.filter(f => column.indexOf(f) !== -1)
      if (intersections.length >= 3) {
        result = true
        return
      }
    })
    return result 
  }

  static _checkThreeNumbersInSameQuadrant (finalNumbers) {
    let result = false
    quadrants.forEach(quadrant => {
      const intersections = finalNumbers.filter(f => quadrant.indexOf(f) !== -1)
      if (intersections.length >= 3) {
        result = true
        return
      }
    })
    return result 
  }

  static _checkThreeNumbersInSameDiagonal (finalNumbers) {
    let result = false
    diagonals.forEach(diagonal => {
      const intersections = finalNumbers.filter(f => diagonal.indexOf(f) !== -1)
      if (intersections.length >= 3) {
        result = true
        return
      } 
    })
    return result 
  }

  static _checkColumns (finalNumbers) {
    let result = true 
    let count = 0
    columns.forEach(column => {
      const intersections = finalNumbers.filter(f => column.indexOf(f) !== -1)
      if (intersections.length > 0) {
        count++
      }
    })
    if (count === 4 || count === 5) {
      result = false
    }
    return result
  }

}

module.exports = Raffle
