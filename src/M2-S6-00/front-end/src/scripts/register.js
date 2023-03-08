import { toastCreateAccount } from "./toast.js";

async function registerRequest(username, email, password, avatar) {
  let requestBody = {
    username: username,
    email: email,
    password: password,
    avatar: avatar,
  }
  const options = {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(requestBody)
  }
  const newUser = await fetch("http://localhost:3333/users/create", options)
    .then((response) => response.json()).then((response) => {
    })
    .catch((err) => console.error(err))
}

function handleRegister() {
  const button = document.querySelector('#submit')
  button.addEventListener('click', (event) => {
    event.preventDefault()
    const username = document.querySelector('#user').value
    const email = document.querySelector('#email').value
    const photo = document.querySelector('#photo').value
    const password = document.querySelector('#password').value

    if (username !== "" && email !== "" && password !== "" && photo !== "") {
      registerRequest(username, email, password, photo).then(() => {
        toastCreateAccount()
      })
    } else {
      alert("Por favor, preencha todos os campos.")
    }
  })
}

function returnLoginButtons() {
  const buttonHeader = document.querySelector(".return__login")
  buttonHeader.addEventListener("click", (event) => {
    eventBackToLogin(event)
  })
  const buttonFooter = document.querySelector(".back__login")
  buttonFooter.addEventListener("click", (event) => {
    eventBackToLogin(event)
  })
}

function eventBackToLogin(event) {
  event.preventDefault()
  window.location.replace("../../index.html")
}

handleRegister()
returnLoginButtons()