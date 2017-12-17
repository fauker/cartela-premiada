'use strict'

const request = require('request')

class ApiUtil {

  static getLastEighteenOrSeventeenNumbers (contest) {
    return new Promise((resolve, reject) => {
      let lastNumbers = []
      request(`https://www.lotodicas.com.br/api/mega-sena/${contest}`, (error, response, body) => {
        if (error) {
          console.log(chalk.red(error))
          process.exit(1)
        }
        
        JSON.parse(body).sorteio.forEach(number => {
          lastNumbers.push(number)
        })

        request(`https://www.lotodicas.com.br/api/mega-sena/${contest-1}`, (error, response, body) => {
          if (error) {
            console.log(chalk.red(error))
            process.exit(1)
          }

          JSON.parse(body).sorteio.forEach(number => {
            lastNumbers.push(number)
          })

          request(`https://www.lotodicas.com.br/api/mega-sena/${contest-2}`, (error, response, body) => {
            if (error) {
              console.log(chalk.red(error))
              process.exit(1)
            }

            JSON.parse(body).sorteio.forEach(number => {
              lastNumbers.push(number)
            })

            const numbersToRemove = Math.floor(Math.random() * 2)

            if (numbersToRemove === 1) {
              const numberToRemove = Math.floor(Math.random() * 18)
              lastNumbers.splice(numberToRemove, 1)
            }

            resolve(lastNumbers)
          })
        })
      })
    })
  } 

  static getLastNumbers (contest) {
    return new Promise((resolve, reject) => {
      let lastNumbers = []
      request(`https://www.lotodicas.com.br/api/mega-sena/${contest}`, (error, response, body) => {
        if (error) {
          console.log(chalk.red(error))
          process.exit(1)
        }
        JSON.parse(body).sorteio.forEach(number => {
          lastNumbers.push(number)
        })
        resolve(lastNumbers)
      })
    })
  }

}

module.exports = ApiUtil
