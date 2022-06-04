
const playerUserNameInput = document.getElementById('userName')
const playerUserPasswordInput = document.getElementById('userPassword')
const SubmitButton = document.getElementById('LoginSubmit')
const registerButton = document.getElementById('registerSubmit')
const logsButton = document.getElementById('logsSubmit')

document.onload = () => {
  playerUserNameInput = document.getElementById('userName')
  sessionStorage.setItem('userName', '')

  playerUserPasswordInput = document.getElementById('userPassword')
  sessionStorage.setItem('userPassword', '')
}

logsButton.addEventListener('click', function(){
  fetch('/Logs/ViewLogs').then((data) => {
    window.location.replace(data.url)
  })
})

registerButton.addEventListener('click', function () {
  const playerUserPassword = sessionStorage.getItem('userPassword')
  const playerUserName = sessionStorage.getItem('userName')
  if (playerUserName.length < 3) {
    window.alert('UserName To Short, requires atleast 3 characters')
    return
  }
  // assigning a temp variable to check the userPassword

  // Placing checks for UserPassword length here, can place additional checks here
  if (playerUserPassword.length < 3) {
    window.alert('Password To Short, requires atleast 3 characters')
    return
  }

  fetch('/Login/Register', {
    method: 'post',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      // Changing the playerName to userName
      playerName: sessionStorage.getItem('userName'),
      userPassword: sessionStorage.getItem('userPassword')
    })
  }).then((data)=> data.json()).then(data =>{
    if(data == -1){
      window.alert("Registration Failed Please, Either password was not value or name is already in use")
    }else{
      window.alert("Registration Sucessful!")
    }
  })

  
})

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
  // Requires DB interation here to check the username and password authenticity

  // temp check for now
  let tempUID = ''
  fetch('/Login/Login', {
    method: 'post',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      // Changing the playerName to userName
      playerName: sessionStorage.getItem('userName'),
      userPassword: sessionStorage.getItem('userPassword')
    })
  }).then(data => {
    return data.json()
  }).then(data => {
    data = data.toString()
    console.log('data: ', data)
    if (data.includes('FAILED')) {
      window.alert('login Failed')
    } else {
      console.log('ID:', data)
      tempUID = data
      sessionStorage.setItem('UID', tempUID)
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
