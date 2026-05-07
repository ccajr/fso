const assert = require('node:assert')
const bcrypt = require('bcrypt')
const { beforeEach, test, after, describe } = require('node:test')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const helper = require('./test_helper')
const Blog = require('../models/blog')
const User = require('../models/user')

const api = supertest(app)
let token

describe('when there is initially some blogs saved', () => {

  beforeEach(async () => {
    await User.deleteMany()

    const passwordHash = await bcrypt.hash('sekret', 10)
    const user = new User({ username: 'root', passwordHash })

    const savedUser = await user.save()

    const response = await api.post('/api/login')
      .send({ username: 'root', password: 'sekret' })
    token = response.body.token

    await Blog.deleteMany()
    helper.initialBlogs.forEach(blog => blog.user = savedUser._id)
    const savedBlogs = await Blog.insertMany(helper.initialBlogs)

    savedUser.blogs = savedBlogs.map(b => b._id)
    await savedUser.save()
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
      .auth(token, { type: 'bearer' })
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const blogs = await helper.blogsInDb()
    assert.strictEqual(blogs.length, helper.initialBlogs.length + 1)

    const users = await helper.usersInDb()
    const userIds = users.map(u => u.id)

    const { id: blogId, user: blogUser, ...targetBlogNoId } = blogs.find(b => b.title === newBlog.title)
    assert.deepStrictEqual(targetBlogNoId, newBlog)
    assert.ok(userIds.includes(blogUser.toString()))

    const targetUser = users.find(u => u.id === blogUser.toString())
    assert.ok(targetUser.blogs.map(b => b.toString()).includes(blogId))
  })

  test('a blog post can be added even if \'likes\' is missing (0 will be set)', async () => {
    const newBlog = {
      title: 'Canonical string reduction',
      author: 'Edsger W. Dijkstra',
      url: 'http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html'
    }

    await api
      .post('/api/blogs')
      .auth(token, { type: 'bearer' })
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const blogs = await helper.blogsInDb()
    assert.strictEqual(blogs.length, helper.initialBlogs.length + 1)

    // eslint-disable-next-line no-unused-vars
    const { id: _, likes: savedLikes, user, ...targetBlogNoId } = blogs.find(b => b.title === newBlog.title)
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
      .auth(token, { type: 'bearer' })
      .send(missingTitle)
      .expect(400)

    const blogs = await helper.blogsInDb()
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
      .auth(token, { type: 'bearer' })
      .send(missingUrl)
      .expect(400)

    const blogs = await helper.blogsInDb()
    assert.strictEqual(blogs.length, helper.initialBlogs.length)
  })

  test('a blog post without \'title\' and \'url\' cannot be added', async () => {
    const missingReq = {
      author: 'Edsger W. Dijkstra (both are missing)',
      likes: 12
    }

    await api
      .post('/api/blogs')
      .auth(token, { type: 'bearer' })
      .send(missingReq)
      .expect(400)

    const blogs = await helper.blogsInDb()
    assert.strictEqual(blogs.length, helper.initialBlogs.length)
  })

  test('a blog post cannot be added if token is not provided', async () => {
    const newBlog = {
      title: 'Canonical string reduction',
      author: 'Edsger W. Dijkstra',
      url: 'http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html',
      likes: 12
    }

    await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(401)

    const blogs = await helper.blogsInDb()
    assert.strictEqual(blogs.length, helper.initialBlogs.length)
  })

  test('a blog post can be deleted', async () => {
    const blogs = await helper.blogsInDb()
    const blogToDelete = blogs[0]

    await api
      .delete(`/api/blogs/${blogToDelete.id}`)
      .auth(token, { type: 'bearer' })
      .expect(204)

    const blogsAfterDelete = await helper.blogsInDb()

    const ids = blogsAfterDelete.map(n => n.id)
    assert(!ids.includes(blogToDelete.id))

    assert.strictEqual(blogsAfterDelete.length, helper.initialBlogs.length - 1)

    const users = await helper.usersInDb()
    const targetUser = users.find(u => u.id === blogToDelete.user.toString())
    assert.ok(!targetUser.blogs.map(b => b.toString()).includes(blogToDelete.id))
  })

  test('a blog post can only be deleted by the user who added it', async () => {
    const blogs = await helper.blogsInDb()
    const blogToDelete = blogs[0]

    const passwordHash = await bcrypt.hash('sekret', 10)
    const otherUser = new User({ username: 'another', passwordHash })
    await otherUser.save()

    const response = await api.post('/api/login')
      .send({ username: 'another', password: 'sekret' })
    const otherToken = response.body.token

    await api
      .delete(`/api/blogs/${blogToDelete.id}`)
      .auth(otherToken, { type: 'bearer' })
      .expect(403)

    const blogsAfterDelete = await helper.blogsInDb()

    const ids = blogsAfterDelete.map(n => n.id)
    assert(ids.includes(blogToDelete.id))

    assert.strictEqual(blogsAfterDelete.length, helper.initialBlogs.length)

    const users = await helper.usersInDb()
    const targetUser = users.find(u => u.id === blogToDelete.user.toString())
    assert.ok(targetUser.blogs.map(b => b.toString()).includes(blogToDelete.id))
  })

  test('a blog post cannot be deleted if token is not provided', async () => {
    const blogs = await helper.blogsInDb()
    const blogToDelete = blogs[0]

    await api
      .delete(`/api/blogs/${blogToDelete.id}`)
      .expect(401)

    const blogsAfterDelete = await helper.blogsInDb()

    const ids = blogsAfterDelete.map(n => n.id)
    assert(ids.includes(blogToDelete.id))

    assert.strictEqual(blogsAfterDelete.length, helper.initialBlogs.length)

    const users = await helper.usersInDb()
    const targetUser = users.find(u => u.id === blogToDelete.user.toString())
    assert.ok(targetUser.blogs.map(b => b.toString()).includes(blogToDelete.id))
  })

  test('a blog post can be updated', async () => {
    const blogs = await helper.blogsInDb()
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

    const blogsAfterUpdate = await helper.blogsInDb()
    const updatedBlogInDb = blogsAfterUpdate.find(b => b.id === blogToUpdate.id)

    assert.deepStrictEqual(updatedBlogInDb, updatedBlog)
  })
})

describe('when there is initially one user in db', () => {
  beforeEach(async () => {
    await User.deleteMany({})

    const passwordHash = await bcrypt.hash('sekret', 10)
    const user = new User({ username: 'root', name: 'admin', passwordHash })

    await user.save()
  })

  test('creation succeeds with a fresh username', async () => {
    const usersAtStart = await helper.usersInDb()

    const newUser = {
      username: 'mluukkai',
      name: 'Matti Luukkainen',
      password: 'salainen',
    }

    await api
      .post('/api/users')
      .send(newUser)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const usersAtEnd = await helper.usersInDb()
    assert.strictEqual(usersAtEnd.length, usersAtStart.length + 1)

    const usernames = usersAtEnd.map(u => u.username)
    assert(usernames.includes(newUser.username))
  })

  test('creation fails with proper statuscode and message if username already taken', async () => {
    const usersAtStart = await helper.usersInDb()

    const newUser = {
      username: 'root',
      name: 'Superuser',
      password: 'salainen',
    }

    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)

    const usersAtEnd = await helper.usersInDb()
    assert(result.body.error.includes('expected `username` to be unique'))

    assert.strictEqual(usersAtEnd.length, usersAtStart.length)
  })

  test('creation fails with proper statuscode and message if username is less than 3 characters long', async () => {
    const usersAtStart = await helper.usersInDb()

    const newUser = {
      username: 'fo',
      name: 'Superuser',
      password: 'salainen',
    }

    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)

    const usersAtEnd = await helper.usersInDb()
    assert(result.body.error.includes('`fo` must be at least 3 characters long'))

    assert.strictEqual(usersAtEnd.length, usersAtStart.length)
  })

  test('creation fails with proper statuscode and message if password is less than 3 characters long', async () => {
    const usersAtStart = await helper.usersInDb()

    const newUser = {
      username: 'root',
      name: 'Superuser',
      password: 'fo',
    }

    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)

    const usersAtEnd = await helper.usersInDb()
    assert(result.body.error.includes('password must be at least 3 characters long'))

    assert.strictEqual(usersAtEnd.length, usersAtStart.length)
  })

  test('creation fails with proper statuscode and message if password is missing', async () => {
    const usersAtStart = await helper.usersInDb()

    const newUser = {
      username: 'root',
      name: 'Superuser',
    }

    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)

    const usersAtEnd = await helper.usersInDb()
    assert(result.body.error.includes('password missing'))

    assert.strictEqual(usersAtEnd.length, usersAtStart.length)
  })
})

after(async () => {
  await mongoose.connection.close()
})