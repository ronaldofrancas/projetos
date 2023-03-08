import { toastCreatePost, toastDeletePost } from "./toast.js"

let user = {}
const url = "http://localhost:3333"
const token = JSON.parse(localStorage.getItem("@petinfo:token"))
const headersRequest = { 
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`
}

async function getUserRequest() {
  const options = { method: "GET", headers: headersRequest }
  await fetch(`${url}/users/profile`, options)
    .then((response) => response.json()).then((response) => {
      user = response
      const photo = document.querySelector("#menu__dropdown--img")
      photo.src = user.avatar
      getPostsRequest()
      createMenuDropdown()
    })
    .catch((err) => console.error(err))
}

async function getPostsRequest() {
  const options = { method: "GET", headers: headersRequest }
  await fetch(`${url}/posts`, options)
    .then((response) => response.json()).then((response) => {
      renderPosts(response)
    })
    .catch((err) => console.error(err))
}

async function createPostRequest(title, content) {
  const requestBody = { title: title, content: content }
  const options = {
    method: "POST",
    headers: headersRequest,
    body: JSON.stringify(requestBody)
  }
  await fetch("http://localhost:3333/posts/create", options)
    .then((response) => response.json()).then((response) => {
      getPostsRequest()
      closeModal()
      toastCreatePost()
    })
    .catch((err) => console.error(err))
}

async function updatePostRequest(id, title, content) {
  const requestBody = { title: title, content: content, }
  const options = {
    method: "PATCH",
    headers: headersRequest,
    body: JSON.stringify(requestBody)
  }
  await fetch(`${url}/posts/${id}`, options)
    .then((response) => response.json()).then((response) => {
      getPostsRequest()
      closeModal()
    })
    .catch((err) => console.error(err))
}

async function deletePostRequest(id) {
  const options = { method: "DELETE", headers: headersRequest }
  await fetch(`${url}/posts/${id}`, options)
    .then((response) => response.json()).then((response) => {
      getPostsRequest()
      closeModal()
      toastDeletePost()
    })
    .catch((err) => console.error(err))
}

function menuDropdown() {
  const button = document.querySelector(".menu__dropdown")
  button.addEventListener("click", () => {
    const menu = document.querySelector("#content").classList.toggle("display-none")
      return menu
  })
}

function createMenuDropdown() {
  const content = document.createElement("div")
  content.classList.add("menu__content", "display-none")
  content.id = "content"
  const username = document.createElement("p")
  username.innerText = `@${user.username}`
  const button = document.createElement("button")
  const image = document.createElement("img")
  image.src = "../assets/sign-out-alt.svg"
  const text = document.createElement("span")
  text.innerText = "Sair da Conta"
  button.addEventListener("click", () => {
    localStorage.clear()
    window.location.replace("../../index.html")
  })
  button.append(image, text)
  content.append(username, button)
  const menu = document.querySelector(".menu__dropdown")
  menu.append(content)
}

function handleButtonCreatePost() {
  const button = document.querySelector(".new__post--button")
  button.addEventListener("click", () => {
    const container = document.querySelector("#modalController")
    container.innerHTML = ""
    let modal = postFormModal(null)
    container.append(modal)
    showModal()
  })
}

function renderPosts(posts) {
  let allPosts = document.querySelector(".posts__container")
  allPosts.innerHTML = ""
  for (let i = posts.length - 1; i >= 0; i--) {
    const render = createPost(posts[i])
    allPosts.append(render)
  }
}

function createPost(post) {
  let buttons = ''
  if (post.user.id == user.id) {
    buttons = `
      <div class="container__buttons">
        <button class="edit__post--button">Editar</button>
        <button class="delete__post--button">Excluir</button>
      </div>
    `
  }
  const postDate = new Date(post.createdAt)
  const month = postDate.toLocaleString('pt-BR', { month: 'long'})
  const year = postDate.getFullYear()
  const postHTML = `
    <div class="post__content">
      <div class="post__header">
        <div class="post__content--info">
          <img src="${post.user.avatar}" alt="${post.user.username}" 
          class="post__user--image">
          <p>${post.user.username}</p>
          <p>|</p>
          <p>${month} de ${year}</p>
        </div>
        ${buttons}
      </div>
      <h2>${post.title}</h2>
      <p>${post.content.substring(0, 145)}...</p>
      <button class="open__modal--button">Acessar Publicação</button>
    </div>
  `
  const container = document.createElement('div')
  container.insertAdjacentHTML('beforeend', postHTML)
  const openModal = container.querySelector('.open__modal--button')
  openModal.addEventListener('click', () => {
    const container = document.querySelector('#modalController')
    container.innerHTML = ''
    const modal = postOpenModal(post)
    container.append(modal)
    showModal()
  })
  if (post.user.id == user.id) {
    const editButton = container.querySelector('.edit__post--button')
    editButton.addEventListener('click', () => {
      const container = document.querySelector('#modalController')
      container.innerHTML = ''
      const modal = postFormModal(post)
      container.append(modal)
      showModal()
    })
    const deleteButton = container.querySelector('.delete__post--button')
    deleteButton.addEventListener('click', () => {
      const container = document.querySelector('#modalController')
      container.innerHTML = ''
      const modal = postDeleteModal(post.id)
      container.append(modal)
      showModal()
    })
  }
  return container
}

function showModal() {
  const modal = document.querySelector("#modalController")
  modal.showModal()
}

function closeModal() {
  const modal = document.querySelector("#modalController")
  modal.close()
}

function postOpenModal(post) {
  let postContainer = document.createElement("div")
  postContainer.classList.add("modal__content")

  let miniHeader = document.createElement("div")
  miniHeader.classList.add("modal__header")

  let userAndDate = document.createElement("div")
  userAndDate.classList.add("user__date")

  let userImg = document.createElement("img")
  userImg.src = post.user.avatar
  userImg.alt = post.user.username
  userImg.classList.add("user__image")

  let userName = document.createElement("p")
  userName.innerText = post.user.username

  let space = document.createElement("p")
  space.innerText = "|"

  let postDate = document.createElement("p")
  let year = new Date(post.createdAt).getFullYear()
  let month = new Date(post.createdAt).toLocaleString("pt-BR", {
    month: "long"
  })
  postDate.innerText = `${month} de ${year}`

  let closeModalSide = document.createElement("div")
  closeModalSide.classList.add("close__modal--container")

  let closeModalButton = document.createElement("button")
  closeModalButton.innerText = "X"
  closeModalButton.classList.add("close__modal")
  closeModalButton.addEventListener("click", closeModal)

  let postTitle = document.createElement("h2")
  postTitle.innerText = post.title

  let postContent = document.createElement("p")
  postContent.innerText = post.content

  userAndDate.append(userImg, userName, space, postDate)
  closeModalSide.append(closeModalButton)
  miniHeader.append(userAndDate, closeModalSide)
  postContainer.append(miniHeader, postTitle, postContent)

  return postContainer
}

function postFormModal(post) {
  let modalContent = document.createElement("div")
  modalContent.classList.add("modal__content")

  let modalHeader = document.createElement("div")
  modalHeader.classList.add("modal__header")

  let modalTitle = document.createElement("h2")
  modalTitle.innerText = post == null ? "Criando Novo Post" : "Edição"

  let closeModalButton = document.createElement("button")
  closeModalButton.innerText = "X"
  closeModalButton.classList.add("close__modal")
  closeModalButton.addEventListener("click", closeModal)

  let postFormModal = document.createElement("form")

  let postTitle = document.createElement("label")
  postTitle.innerText = "Título do Post"
  postTitle.htmlFor = "postTitleInput"

  let postTitleInput = document.createElement("input")
  postTitleInput.id = "postTitleInput"
  postTitleInput.placeholder = "Digite o título aqui..."

  let postContent = document.createElement("label")
  postContent.innerText = "Conteúdo do Post"
  postContent.htmlFor = "postContentInput"

  let postContentInput = document.createElement("textarea")
  postContentInput.id = "postContentInput"
  postContentInput.placeholder = "Desenvolva o conteúdo do post aqui..."
  postContentInput.rows = "6"

  if (post != null) {
    postTitleInput.value = post.title
    postContentInput.value = post.content
  }

  let buttonsModalDiv = document.createElement("div")
  buttonsModalDiv.classList.add("container__buttons--modal")

  let cancelButtonModal = document.createElement("button")
  cancelButtonModal.innerText = "Cancelar"
  cancelButtonModal.classList.add("cancel__modal--button")
  cancelButtonModal.addEventListener("click", closeModal)

  let submitButtonModal = document.createElement("button")
  submitButtonModal.type = "submit"
  if (post == null) {
    submitButtonModal.innerText = "Publicar"
    submitButtonModal.addEventListener("click", () => {
      createPostRequest(postTitleInput.value, postContentInput.value)
    })
  } else {
    submitButtonModal.innerText = "Salvar Alterações"
    submitButtonModal.addEventListener("click", () => {
      updatePostRequest(post.id, postTitleInput.value, postContentInput.value)
    })
  }

  buttonsModalDiv.append(cancelButtonModal, submitButtonModal)
  postFormModal.append(
    postTitle,
    postTitleInput,
    postContent,
    postContentInput
  )
  modalHeader.append(modalTitle, closeModalButton)
  modalContent.append(modalHeader, postFormModal, buttonsModalDiv)

  return modalContent
}

function postDeleteModal(id) {
  let modalContent = document.createElement("div")
  modalContent.classList.add("modal__content")

  let modalHeader = document.createElement("div")
  modalHeader.classList.add("modal__header")

  let modalTitle = document.createElement("h2")
  modalTitle.innerText = "Confirmação de Exclusão"

  let closeModalButton = document.createElement("button")
  closeModalButton.innerText = "X"
  closeModalButton.classList.add("close__modal")
  closeModalButton.addEventListener("click", closeModal)

  let deleteTitle = document.createElement("h1")
  deleteTitle.innerText = "Tem certeza que deseja excluir este post?"

  let deleteInfo = document.createElement("p")
  deleteInfo.innerText =
    "Essa ação não poderá ser desfeita, então pedimos que tenha cautela antes de concluir"

  let buttonsModalDiv = document.createElement("div")
  buttonsModalDiv.classList.add("container__buttons--modal")

  let cancelButtonModal = document.createElement("button")
  cancelButtonModal.innerText = "Cancelar"
  cancelButtonModal.classList.add("cancel__modal--button")
  cancelButtonModal.addEventListener("click", closeModal)

  let deleteButtonModal = document.createElement("button")
  deleteButtonModal.innerText = "Sim, excluir este post"
  deleteButtonModal.classList.add("delete__modal--button")
  deleteButtonModal.addEventListener("click", () => {
    deletePostRequest(id)
  })

  buttonsModalDiv.append(cancelButtonModal, deleteButtonModal)
  modalHeader.append(modalTitle, closeModalButton)
  modalContent.append(modalHeader, deleteTitle, deleteInfo, buttonsModalDiv)

  return modalContent
}

getUserRequest()
menuDropdown()
handleButtonCreatePost()