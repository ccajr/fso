import { useState, useEffect } from 'react'
import { Routes, Route, Link, useNavigate, useMatch } from 'react-router-dom'
import {
  Container,
  AppBar,
  Button,
  TextField,
  Toolbar,
  Typography,
} from '@mui/material'
import Blog from './components/Blog'
import BlogForm from './components/BlogForm'
import Notification from './components/Notification'
import ErrorBoundary from './components/ErrorBoundary'
import blogService from './services/blogs'
import loginService from './services/login'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)
  const [notification, setNotification] = useState(null)
  const navigate = useNavigate()

  useEffect(() => {
    blogService
      .getAll()
      .then((blogs) => setBlogs(blogs.sort((a, b) => b.likes - a.likes)))
  }, [])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogAppUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

  const displayNotification = (text, type) => {
    setNotification({
      text: text,
      type: type,
    })

    setTimeout(() => {
      setNotification(null)
    }, 5000)
  }

  const handleLogout = () => {
    window.localStorage.removeItem('loggedBlogAppUser')
    setUsername('')
    setPassword('')
    setUser(null)
  }

  const handleLogin = async (event) => {
    event.preventDefault()

    try {
      const user = await loginService.login({ username, password })
      window.localStorage.setItem('loggedBlogAppUser', JSON.stringify(user))
      blogService.setToken(user.token)
      setUser(user)
      navigate('/')
      setUsername('')
      setPassword('')
    } catch {
      displayNotification('wrong username or password', 'error')
    }
  }

  const loginForm = () => (
    <form onSubmit={handleLogin}>
      <div>
        <h2>Log in to application</h2>
        <TextField
          label='username'
          type='text'
          value={username}
          onChange={({ target }) => setUsername(target.value)}
          variant='standard'
        />
      </div>
      <div>
        <TextField
          label='password'
          type='password'
          value={password}
          onChange={({ target }) => setPassword(target.value)}
          variant='standard'
        />
      </div>
      <Button type='submit' variant='contained' style={{ marginTop: 10 }}>
        login
      </Button>
    </form>
  )

  const createBlog = async (blogObject) => {
    try {
      const blog = await blogService.create(blogObject)
      setBlogs(blogs.concat(blog))
      navigate('/')
      displayNotification(
        `a new blog ${blog.title} by ${blog.author} added`,
        'success',
      )
    } catch (error) {
      displayNotification(
        error?.response?.data?.error || error.message,
        'error',
      )
    }
  }

  const updateBlog = async (id, blogObject) => {
    const updatedBlog = await blogService.update(id, blogObject)
    setBlogs(
      blogs
        .map((blog) => (blog.id === id ? updatedBlog : blog))
        .sort((a, b) => b.likes - a.likes),
    )
  }

  const deleteBlog = async (id) => {
    await blogService.remove(id)
    setBlogs(blogs.filter((blog) => blog.id !== id))
    navigate('/')
  }

  const match = useMatch('/blogs/:id')
  const blog = match ? blogs.find((blog) => blog.id === match.params.id) : null

  const style = { '&:hover': { bgcolor: 'rgba(255,255,255,0.3)' } }

  return (
    <Container>
      <AppBar position='static'>
        <Toolbar>
          <Typography variant='h6' component='div' sx={{ flexGrow: 1 }}>
            Blog App
          </Typography>
          <Button color='inherit' component={Link} to='/' sx={style}>
            blogs
          </Button>
          {!user && (
            <Button color='inherit' component={Link} to='/login' sx={style}>
              login
            </Button>
          )}
          {user && (
            <>
              <Button color='inherit' component={Link} to='/create' sx={style}>
                new blog
              </Button>
              <Button color='inherit' onClick={handleLogout} sx={style}>
                logout
              </Button>
            </>
          )}
        </Toolbar>
      </AppBar>
      <br />
      <ErrorBoundary>
        <Notification notification={notification} />

        <Routes>
          <Route
            path='/'
            element={
              <div>
                <h2>blogs</h2>
                <ul>
                  {blogs.map((blog) => (
                    <li key={blog.id}>
                      <Link to={`/blogs/${blog.id}`}>
                        {blog.title} by {blog.author}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            }
          />
          <Route
            path='/blogs/:id'
            element={
              <Blog
                blog={blog}
                user={user}
                updateBlog={updateBlog}
                deleteBlog={deleteBlog}
              />
            }
          />
          <Route
            path='/create'
            element={user && <BlogForm createBlog={createBlog} />}
          />
          <Route path='/login' element={!user && loginForm()} />
          <Route path='*' element={<h2>404 - Page not found</h2>} />
        </Routes>
      </ErrorBoundary>
    </Container>
  )
}

export default App
