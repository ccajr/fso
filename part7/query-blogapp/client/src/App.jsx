import { useState, useEffect, useContext } from 'react'
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
import useNotification from './hooks/useNotification'
import { useBlogs } from './hooks/useBlogs'
import UserContext from './UserContext'

const App = () => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const { user, setUser } = useContext(UserContext)
  const navigate = useNavigate()
  const { notify } = useNotification()
  const { blogs } = useBlogs()

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogAppUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [setUser])

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
      notify('wrong username or password', 'error')
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
        <Notification />

        <Routes>
          <Route
            path='/'
            element={
              <div>
                <h2>blogs</h2>
                <ul>
                  {blogs
                    ?.toSorted((a, b) => b.likes - a.likes)
                    .map((blog) => (
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
          <Route path='/blogs/:id' element={<Blog blog={blog} />} />
          <Route path='/create' element={user && <BlogForm />} />
          <Route path='/login' element={!user && loginForm()} />
          <Route path='*' element={<h2>404 - Page not found</h2>} />
        </Routes>
      </ErrorBoundary>
    </Container>
  )
}

export default App
