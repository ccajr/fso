const getUser = () => {
  return window.localStorage.getItem('loggedBlogAppUser')
}
const saveUser = (user) => {
  window.localStorage.setItem('loggedBlogAppUser', JSON.stringify(user))
}
const removeUser = () => {
  window.localStorage.removeItem('loggedBlogAppUser')
}

export default { getUser, saveUser, removeUser }
