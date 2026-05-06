const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/user')

blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({}).populate('user', { username: 1, name: 1 })
  response.json(blogs)
})

blogsRouter.post('/', async (request, response) => {
  const blog = new Blog(request.body)

  if (!blog.likes) {
    blog.likes = 0
  }

  const users = await User.find({})
  if (users && users.length > 0) {
    blog.user = users[0].id
  }

  const savedBlog = await blog.save()

  if (users && users.length > 0) {
    users[0].blogs = users[0].blogs.concat(savedBlog._id)
    await users[0].save()
  }

  response.status(201).json(savedBlog)
})

blogsRouter.delete('/:id', async (request, response) => {
  await Blog.findByIdAndDelete(request.params.id)
  response.status(204).end()
})

blogsRouter.put('/:id', async (request, response) => {
  const blog = await Blog.findById(request.params.id)
  if (!blog) {
    return response.status(404).end()
  }

  const { title, author, url, likes } = request.body

  blog.title = title
  blog.author = author
  blog.url = url
  blog.likes = likes ?? 0

  const updatedBlog = await blog.save()
  response.json(updatedBlog)
})

module.exports = blogsRouter