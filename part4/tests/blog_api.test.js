const assert = require('node:assert')
const { beforeEach, test, after } = require('node:test')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const helper = require('./test_helper')
const Blog = require('../models/blog')

const api = supertest(app)

beforeEach(async () => {
  await Blog.deleteMany()
  await Blog.insertMany(helper.initialBlogs)
})

test('blogs are returned as json', async () => {
  await api
    .get('/api/blogs')
    .expect(200)
    .expect('Content-Type', /application\/json/)
})

test('correct amount of blogs are returned', async () => {
  const response = await api.get('/api/blogs')

  assert.strictEqual(response.body.length, helper.initialBlogs.length)
})

test('unique identifier property of the blog posts is named id', async () => {
  const response = await api.get('/api/blogs')
  assert(Object.hasOwn(response.body[0], 'id'))
})

test('a valid blog post can be added', async () => {
  const newBlog = {
    title: 'Canonical string reduction',
    author: 'Edsger W. Dijkstra',
    url: 'http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html',
    likes: 12
  }

  await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(201)
    .expect('Content-Type', /application\/json/)

  const blogs = await helper.notesInDb()
  assert.strictEqual(blogs.length, helper.initialBlogs.length + 1)

  // eslint-disable-next-line no-unused-vars
  const { id: _, ...targetBlogNoId } = blogs.find(b => b.title === newBlog.title)
  assert.deepStrictEqual(targetBlogNoId, newBlog)
})

test('a blog post can be added even if \'likes\' is missing (0 will be set)', async () => {
  const newBlog = {
    title: 'Canonical string reduction',
    author: 'Edsger W. Dijkstra',
    url: 'http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html'
  }

  await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(201)
    .expect('Content-Type', /application\/json/)

  const blogs = await helper.notesInDb()
  assert.strictEqual(blogs.length, helper.initialBlogs.length + 1)

  // eslint-disable-next-line no-unused-vars
  const { id: _, likes: savedLikes, ...targetBlogNoId } = blogs.find(b => b.title === newBlog.title)
  assert.deepStrictEqual(targetBlogNoId, newBlog)
  assert.deepStrictEqual(savedLikes, 0)
})

test('a blog post without \'title\' cannot be added', async () => {
  const missingTitle = {
    author: 'Edsger W. Dijkstra (no title)',
    url: 'http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html',
    likes: 12
  }

  await api
    .post('/api/blogs')
    .send(missingTitle)
    .expect(400)

  const blogs = await helper.notesInDb()
  assert.strictEqual(blogs.length, helper.initialBlogs.length)
})

test('a blog post without \'url\' cannot be added', async () => {
  const missingUrl = {
    title: 'Canonical string reduction (no url)',
    author: 'Edsger W. Dijkstra',
    likes: 12
  }

  await api
    .post('/api/blogs')
    .send(missingUrl)
    .expect(400)

  const blogs = await helper.notesInDb()
  assert.strictEqual(blogs.length, helper.initialBlogs.length)
})

test('a blog post without \'title\' and \'url\' cannot be added', async () => {
  const missingReq = {
    author: 'Edsger W. Dijkstra (both are missing)',
    likes: 12
  }

  await api
    .post('/api/blogs')
    .send(missingReq)
    .expect(400)

  const blogs = await helper.notesInDb()
  assert.strictEqual(blogs.length, helper.initialBlogs.length)
})

test('a blog post can be deleted', async () => {
  const blogs = await helper.notesInDb()
  const blogToDelete = blogs[0]

  await api.delete(`/api/blogs/${blogToDelete.id}`).expect(204)

  const blogsAfterDelete = await helper.notesInDb()

  const ids = blogsAfterDelete.map(n => n.id)
  assert(!ids.includes(blogsAfterDelete.id))

  assert.strictEqual(blogsAfterDelete.length, helper.initialBlogs.length - 1)
})

test('a blog post can be updated', async () => {
  const blogs = await helper.notesInDb()
  const blogToUpdate = blogs[0]

  const updatedBlog = {
    ...blogToUpdate,
    title: 'Updated Title',
    author: 'Updated Author',
    url: 'http://updated.url',
    likes: 999
  }

  await api
    .put(`/api/blogs/${blogToUpdate.id}`)
    .send(updatedBlog)
    .expect(200)
    .expect('Content-Type', /application\/json/)

  const blogsAfterUpdate = await helper.notesInDb()
  const updatedBlogInDb = blogsAfterUpdate.find(b => b.id === blogToUpdate.id)

  assert.deepStrictEqual(updatedBlogInDb, updatedBlog)
})

after(async () => {
  await mongoose.connection.close()
})