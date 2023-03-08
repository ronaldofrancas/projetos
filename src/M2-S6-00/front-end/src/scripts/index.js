import { toastLoginSucess } from "./toast.js"

const url = "http://localhost:3333"
const token = JSON.parse(localStorage.getItem('@petinfo:token'))
const headersRequest = { "Content-Type": "application/json" }

function login() {
  const button = document.querySelector("#submit")
  button.addEventListener("click", (event) => {
    event.preventDefault()
    const email = document.querySelector("#email")
    const password = document.querySelector("#password")
    const emailError = document.querySelector("#emailErr")
    const passwordError = document.querySelector("#passwordErr")
    if (email.value != "" && password.value != "") {
      email.classList.remove("error")
      emailError.innerHTML = ""
      password.classList.remove("error")
      passwordError.innerHTML = ""
      loginRequest(email.value, password.value)
    }
    if (email.value == "") {
      error(email, emailError, "O email é obrigatório!")
    }
    if (password.value == "") {
      error(password, passwordError, "A senha é obrigatória!")
    }
  })
  email.addEventListener('input', () => {
    const emailError = document.querySelector('#emailErr')
    email.classList.remove('error')
    emailError.innerHTML = ''
  })
  password.addEventListener('input', () => {
    const passwordError = document.querySelector('#passwordErr')
    password.classList.remove('error')
    passwordError.innerHTML = ''
  })
}

function register() {
  const signupButton = document.querySelector("#signup")
  signupButton.addEventListener("click", (event) => {
    event.preventDefault()
    window.location.replace("./src/pages/register.html")
  })
}

export function error(field, error, message) {
  error.classList.add("error")
  error.innerHTML = message
  field.classList.add("error")
}

async function loginRequest(email, password) {
  const requestBody = { email: email, password: password }
  const options = { 
      method: "POST", 
      headers: headersRequest, 
      body: JSON.stringify(requestBody)
  }

  const token = await fetch(`${url}/login`, options)
    .then(response => response.json()).then(response => {
      if ("message" in response) {
        let message = response.message
        if (message.toLowerCase().includes('email')) {
          const email = document.querySelector('#email')
          const emailErr = document.querySelector('#emailErr')
          error(email, emailErr, message)
        }
        if (message.toLowerCase().includes('senha')) {
          const password = document.querySelector('#password')
          const passwordErr = document.querySelector('#passwordErr')
          error(password, passwordErr, message)
        }
      } else {
        localStorage.setItem('@petinfo:token', JSON.stringify(response.token))
        toastLoginSucess()
      }
    })
    .catch(err => {})

    return token
}

function clearTokenStorage() {
  localStorage.clear()
}

login()
register()
clearTokenStorage()