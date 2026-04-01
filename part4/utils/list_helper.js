const _ = require('lodash')

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

const mostBlogs = (blogs) => {
  if (!blogs || blogs.length === 0) {
    return undefined
  }

  const countPerAuthor = _.countBy(blogs, blog => blog.author)
  const maxCount = Math.max(..._.map(countPerAuthor, val => val))

  return {
    author: _.keys(_.pickBy(countPerAuthor, count => count === maxCount))[0], // Only first author
    blogs: maxCount
  }
}

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs
}