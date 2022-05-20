// https://docs.microsoft.com/en-us/azure/azure-sql/database/connect-query-nodejs?view=azuresql&tabs=windows

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

//Retrive total word count note async
const getWordCount = async () => {
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

//Returns id for word exist in database, -1 otherwise. note async
const IsLegalWord = async (attemptWord) =>{
  try{
    const sqlCom = 'SELECT [id] FROM [dbo].[wordle_word] WHERE [word] = \'' + attemptWord + '\''

    const wordFound = await ConnectAndExecute(sqlCom)

    if(wordFound.length){
      return wordFound[0][1]
    }
    else{
      return -1
    }
  }catch(err){
    console.log(err)
  }
}

//Require account name and hashed password both in string note async
const RegisterPlayer = async (accountName, hashedPassword) => {
  try{
    const sqlCom = 'INSERT INTO [dbo].[player_account] VALUES (\'' + accountName + '\',\'' + hashedPassword + '\', 0, 0)'

    await ConnectAndExecute(sqlCom)
  }catch(err){
    console.log(err)
  }
}

//Requires account name and hashed password, returns -1 for if the account doesnt exist or account and password doesnt match. returns the ID of account if it matches. note async
const PlayerLogin = async (accountName, hashedPassword) => {
  try{
    const sqlCom = 'SELECT [id], [player_account_name], [hashed_password] FROM [dbo].[player_account] WHERE [player_account_name] = \'' + accountName + '\''

    accountDetail = await ConnectAndExecute(sqlCom)

    if (accountDetail.length > 0)
    {
      if (hashedPassword == accountDetail[2][1])
      {
        return accountDetail[0][1]
      }
      else{
        return -1
      }
    }
    else{
      return -1
    }
  }catch(err){
    console.log(err)
  }
}

//Increments player streak by 1 and updates high score if the streak is higher than previous high score note async
const IncrementStreak = async (playerID) => {
  try{
    var sqlCom = 'UPDATE [dbo].[player_account] SET [streak] = [streak] + 1 WHERE [id] = ' + playerID.toString(10)

    await ConnectAndExecute(sqlCom)

    sqlCom = 'SELECT [high_score],[streak] FROM [dbo].[player_account] WHERE [id] = ' + playerID.toString(10)

    accountDetail = await ConnectAndExecute(sqlCom)

    if(accountDetail[0][1] < accountDetail[1][1]){
      sqlCom = 'UPDATE [dbo].[player_account] SET [high_score] = [streak] WHERE [id] = ' + playerID.toString(10)

      await ConnectAndExecute(sqlCom)
    }
  }catch(err){
    console.log(err)
  }
}

//sets streak to 0 after player loses in a game note async
const ResetStreak = async (playerID) => {
  try{
    const sqlCom = 'UPDATE [dbo].[player_account] SET [streak] = 0 WHERE [id] = ' + playerID.toString(10)

    await ConnectAndExecute(sqlCom)
  }catch(err){
    console.log(err)
  }
}

//Game mode is string, word_id is int and match start date is string in format 'YYYY-MM-DD' e.g. '2022-04-28' RETURNS the match id note async
const CreateMatch = async (gameMode, wordID, matchStartDate) => {
  try{
    const sqlCom = 'INSERT INTO [dbo].[match_log] OUTPUT INSERTED.[id] VALUES (\'' + gameMode + '\',' + wordID + ',\'' + matchStartDate + '\')'

    const matchID = await ConnectAndExecute(sqlCom)

    return matchID[0][1]
  }catch(err){
    console.log(err)
  }
}

//Logs player action by match_id, player_id and attempWordID which are all int as well as an attempted_date_time which is a string in format 'YYYY-MM-DD HH:MI:SS' note async
const LogPlayerAction = async (matchID, playerID, attemptWordID, attemptDateTime) => {
  try{
    const sqlCom = 'INSERT INTO [dbo].[action_log] VALUES (' + matchID + ',' + playerID + ',' + attemptWordID + ',\'' + attemptDateTime + '\')'

    await ConnectAndExecute(sqlCom)
  }catch(err){
    console.log(err)
  }
}

/*PlayerLogin('testaccount', 'hashedpassword').then(result => {
  console.log(result)
})
.catch(err =>{
  console.log(err)
})*/

//RegisterPlayer('testaccount', 'hashedpassword')

//ResetStreak(1)

//IncrementStreak(1)

/*CreateMatch('random', 17, '2022-04-21').then(result =>{
  console.log(result)
})
.catch(err => {
  console.log(err)
})*/

//LogPlayerAction(3,1,14,'2022-04-21 13:32:42')
