// https://docs.microsoft.com/en-us/azure/azure-sql/database/connect-query-nodejs?view=azuresql&tabs=windows

function RecordPlayerAction (playerName, playerWord) {
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
    })

    connection.execSql(request)
  }
}

const testName = 'First'
const testWord = 'Train'
RecordPlayerAction(testName, testWord)
