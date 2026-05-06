const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const { userExtractor } = require('../utils/middleware')

blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({}).populate('user', { username: 1, name: 1 })
  response.json(blogs)
})

blogsRouter.post('/', userExtractor, async (request, response) => {
  const blog = new Blog(request.body)
  const user = request.user

  if (!user) {
    return response.status(400).json({ error: 'UserId missing or not valid' })
  }

  if (!blog.likes) {
    blog.likes = 0
  }

  blog.user = user._id

  const savedBlog = await blog.save()
  user.blogs = user.blogs.concat(savedBlog._id)
  await user.save()

  response.status(201).json(savedBlog)
})

blogsRouter.delete('/:id', userExtractor, async (request, response) => {
  const user = request.user

  if (!user) {
    return response.status(400).json({ error: 'UserId missing or not valid' })
  }

  const blog = await Blog.findById(request.params.id)

  if (blog && blog.user.toString() !== user._id.toString()) {
    return response.status(403).json({ error: 'Only the user who added the blog can delete it' })
  }

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