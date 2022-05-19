// https://docs.microsoft.com/en-us/azure/azure-sql/database/connect-query-nodejs?view=azuresql&tabs=windows

/*function RecordPlayerAction (playerName, playerWord) {
  // https://stackoverflow.com/questions/59151116/insert-into-azure-sql-database-from-nodejs
  // SQL satement

  // Create connection to database
  const { Connection, Request } = require('tedious')
  // const { finished } = require('tedious/lib/message')

  // Creates config for server connection
  const config = {
    authentication: {
      options: {
        userName: 'elen4010group09', // update me
        password: 'Group09@elen40102022' // update me
      },
      type: 'default'
    },
    server: 'wordletoo.database.windows.net', // update me
    options: {
      database: 'ELEN4020_wordletoo_production', // update me
      encrypt: true
    }
  }

  // creates connection object with our server info
  const connection = new Connection(config)

  connection.connect()

  // Attempt to connect and execute queries if connection goes through
  connection.on('connect', err => {
    if (err) {
      console.error(err.message)
    } else {
      console.log('DB Connection Successful')
      // call function to add player record to db
      addRow()
    }
  })

  function addRow () {
    // using a temp table which will be developed further when more advanced table connections are required
    const sql = 'INSERT INTO [dbo].[temp_player_log] (player_name, player_word) VALUES (\'' + playerName + '\', \'' + playerWord + '\')'
    console.log('query ==== ' + sql)

    // Read all rows from table
    const request = new Request(
      sql,
      (err, rowCount) => {
        if (err) {
          console.error(err.message)
        } else {
          console.log(`${rowCount} row(s) returned`)
        }
      }
    )

    // Used to make output neat
    request.on('row', columns => {
      columns.forEach(column => {
        console.log('%s\t%s', column.metadata.colName, column.value)
      })
    })

    // when requests are completed close connection
    request.on('requestCompleted', function (rowCount, more) {
      connection.close()
      //return
    })

    connection.execSql(request)
  }
}*/


const ConnectAndExecute = (sqlCommand) => new Promise((resolve, reject) => {
  // https://stackoverflow.com/questions/59151116/insert-into-azure-sql-database-from-nodejs
  // SQL satement

  // Create connection to database
  const { Connection, Request } = require('tedious')
  // const { finished } = require('tedious/lib/message')

  // Creates config for server connection
  const config = {
    authentication: {
      options: {
        userName: 'elen4010group09', // update me
        password: 'Group09@elen40102022' // update me
      },
      type: 'default'
    },
    server: 'wordletoo.database.windows.net', // update me
    options: {
      database: 'ELEN4020_wordletoo_production', // update me
      encrypt: true,
      trustServerCertificate: true
    }
  }

  // creates connection object with our server info
  const connection = new Connection(config)

  connection.connect()

  // Attempt to connect and execute queries if connection goes through
  connection.on('connect', async err => {
    if (err) {
      console.error(err.message)
    } else {
      console.log('DB Connection Successful')
      // call function to add player record to db
      ExecuteSQLStatement(sqlCommand)
        .then(result => {
          resolve(result)
        })
        .catch(err => {
          reject(err)
        })
    }
  })

  function ExecuteSQLStatement(sqlCommand) {
    return new Promise((resolve, reject) => {
      // using a temp table which will be developed further when more advanced table connections are required
      const sql = sqlCommand
      console.log('query ==== ' + sql)

      // Read all rows from table
      const request = new Request(
        sql,
        (err, rowCount) => {
          if (err) {
            reject(err)
          } else {
            console.log(`${rowCount} row(s) returned`)
          }
        }
      )

      var sqlResults = []

      // Used to make output neat
      request.on('row', columns => {
        columns.forEach(column => {
          //console.log('%s\t%s', column.metadata.colName, column.value)
          sqlResults.push([column.metadata.colName, column.value])
        })
      })



      // when requests are completed close connection
      request.on('requestCompleted', function (rowCount, more) {
        connection.close()
        resolve(sqlResults)
      })

      connection.execSql(request)
    })
  }
})

const getWordCount = async () => {
  //var sqlCom = 'SELECT [word] FROM [dbo].[wordle_word] WHERE [id] <= 10'
  var sqlCom = 'SELECT COUNT(*) FROM [dbo].[wordle_word]'
  try{
    const result = await ConnectAndExecute(sqlCom)
    return result[0][1]
  }catch(err){
    console.log(err)
  }
}

//Use this to get a random word note async
const getRandomWord = async () => {
  try{
    const wordCount = await getWordCount()

    const randomWordID = parseInt((Math.random() * wordCount) + 1)

    const sqlCom = 'SELECT [word] FROM [dbo].[wordle_word] WHERE [id] = \'' + randomWordID.toString(10) + '\''

    const randomWord = await ConnectAndExecute(sqlCom)

    return randomWord[0][1]
  }catch(err){
    console.log(err)
  }
}

//Returns true for word exist in database, false otherwise note async
const IsLegalWord = async (attemptWord) =>{
  try{
    const sqlCom = 'SELECT [word] FROM [dbo].[wordle_word] WHERE [word] = \'' + attemptWord + '\''

    const wordFound = await ConnectAndExecute(sqlCom)

    if(wordFound.length){
      return true
    }
    else{
      return false
    }
  }catch(err){
    console.log(err)
  }
}



/*const testName = 'First'
const testWord = 'Train'
RecordPlayerAction(testName, testWord)*/

IsLegalWord('aaaaa').then(result => {
  console.log(result)
})
.catch(err =>{
  console.log(err)
})