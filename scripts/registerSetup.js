
const playerUserNameInput = document.getElementById('userName')
const playerUserPasswordInput = document.getElementById('userPassword')
const SubmitButton = document.getElementById('RegisterSubmit')

document.onload = () => {
  playerUserNameInput = document.getElementById('userName')
  sessionStorage.setItem('userName', '')

  playerUserPasswordInput = document.getElementById('userPassword')
  sessionStorage.setItem('userPassword', '')
}

SubmitButton.addEventListener('click', function () {
  // assigning a temp variable to check the username
  const playerUserName = sessionStorage.getItem('userName')
  // Placing checks for username length here, can place additional checks here
  if (playerUserName.length < 3) {
    window.alert('UserName To Short, requires atleast 3 characters')
    return
  }
  // assigning a temp variable to check the userPassword
  const playerUserPassword = sessionStorage.getItem('userName')
  // Placing checks for UserPassword length here, can place additional checks here
  if (playerUserPassword.length < 3) {
    window.alert('Password To Short, requires atleast 3 characters')
    return
  }
  // Requires DB interation here to check the username and password availability

  // temp check for now
  if (playerUserName === 'Admin') {
    console.log('Username is Available')
    if (playerUserPassword === 'Admin') {
      console.log('Passed Password Check')
    } else {
      console.log('Failed Password Check')
      window.alert('Failled Password Check')
      return
    }
  } else {
    console.log('Username is unavailable')
    window.alert('Username is unavailable')
    return
  }

  // Passed all the checks
  // Loading into the game queue
  let tempUID = ''
  fetch('/Auth/GenerateNewUID', {
    method: 'post',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      // Changing the playerName to userName
      playerName: sessionStorage.getItem('userName')
    })
  }).then((response) => {
    console.log(response)
    return response.json()
  }).then((data) => {
    console.log(data)
    if (data.includes('FAILED')) {
      console.log('UID Already in use, choose another name')
      window.alert('Name already being used at the current moment!')
    } else {
      tempUID = data
      console.log('UID Recieved from server!')
      sessionStorage.setItem('UID', tempUID)
      console.log(tempUID)
    }
  }).then(() => {
    if (tempUID !== '') {
      fetch('/Auth/LobbyOpen', { // First request gos to check if their is a game already in pogress
        method: 'get',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json'
        }
      }).then((data) => { // converting the response to json
        return data.json()
      }).then((data) => {
        console.log('Any truers??', data)
        if (data === true) { // checking if we are allowed into the queue system
          fetch('/Auth/AddNewConnection', {
            method: 'post',
            headers: {
              Accept: 'application/json',
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              // Changing tempPlayerName to playerUserName
              playerName: playerUserName, // sending our data to the queue server
              UID: tempUID.toString()
            })
          })
            .then((response) => {
              console.log(response)
              window.location.replace(response.url)
            })
        } else if (data === false) { // if  you cant join the queue system wait
          window.alert('Cannot Join, Game is already in progress')
        }
      })
    }
  })
})

playerUserNameInput.addEventListener('input', function () {
  sessionStorage.setItem('userName', playerUserNameInput.value)
  console.log('Saved: ' + sessionStorage.getItem('userName'))
  // GenerateUniqueHash(sessionStorage.getItem("userName"))
})

playerUserPasswordInput.addEventListener('input', function () {
  sessionStorage.setItem('userPassword', playerUserPasswordInput.value)
  console.log('Saved: ' + sessionStorage.getItem('userPassword'))
  // GenerateUniqueHash(sessionStorage.getItem("userPassword"))
})
