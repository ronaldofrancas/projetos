export function toastLoginSucess() {
  const toast = document.querySelector('.toast')
  toast.classList.add('show__toast')
  setTimeout(() => {
    toast.classList.remove('show__toast')
    window.location.replace('./src/pages/dashboard.html')
  }, 2000)
}

export function toastCreateAccount() {
  const toast = document.querySelector(".toast")
  toast.classList.add("show__toast")
  setTimeout(() => {
    toast.classList.remove("show__toast")
    window.location.replace("../../index.html")
  }, 2000)
}

export function toastCreatePost() {
  const toast = document.querySelector(".toast")
  toast.classList.add("show__toast")
  setTimeout(() => {
    toast.classList.remove("show__toast")
  })
}

export function toastDeletePost() {
  const toast = document.querySelector(".toast")
  toast.classList.add("show__toast")
  setTimeout(() => {
    toast.classList.remove("show__toast")
  }, 2000)
}
