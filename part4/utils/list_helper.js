const dummy = () => {
  return 1
}

const totalLikes = (blogs) => {
  if (!blogs) {
    return 0
  }

  return blogs.map(blog => blog.likes)
    .reduce((a, b) => a + b, 0)
}

const favoriteBlog = (blogs) => {
  if (!blogs || blogs.length === 0) {
    return undefined
  }

  const maxLikes = Math.max(...blogs.map(blog => blog.likes))

  return blogs.find(blog => blog.likes === maxLikes)
}

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog
}