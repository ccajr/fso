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
import User from './components/User'
import UserList from './components/UserList'
import blogService from './services/blogs'
import loginService from './services/login'
import persistentUser from './services/persistentUser'
import useNotification from './hooks/useNotification'
import { useBlogs } from './hooks/useBlogs'
import UserContext from './UserContext'
import { useUsers } from './hooks/useUsers'

const App = () => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const { user: loginUser, setUser: setLoginUser } = useContext(UserContext)
  const navigate = useNavigate()
  const { notify } = useNotification()
  const { blogs } = useBlogs()
  const { users, isPending: userIsPending } = useUsers()

  useEffect(() => {
    const loggedUserJSON = persistentUser.getUser()
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setLoginUser(user)
      blogService.setToken(user.token)
    }
  }, [setLoginUser])

  const handleLogout = () => {
    persistentUser.removeUser()
    setUsername('')
    setPassword('')
    setLoginUser(null)
  }

  const handleLogin = async (event) => {
    event.preventDefault()

    try {
      const user = await loginService.login({ username, password })
      persistentUser.saveUser(user)
      blogService.setToken(user.token)
      setLoginUser(user)
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
  const blog = match ? blogs?.find((blog) => blog.id === match.params.id) : null

  const userMatch = useMatch('/users/:id')
  const user = userMatch
    ? users?.find((user) => user.id === userMatch.params.id)
    : null

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
          <Button color='inherit' component={Link} to='/users' sx={style}>
            users
          </Button>
          {!loginUser && (
            <Button color='inherit' component={Link} to='/login' sx={style}>
              login
            </Button>
          )}
          {loginUser && (
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
          <Route path='/users' element={<UserList />} />
          <Route
            path='/users/:id'
            element={<User user={user} isPending={userIsPending} />}
          />
          <Route path='/create' element={loginUser && <BlogForm />} />
          <Route path='/login' element={!loginUser && loginForm()} />
          <Route path='*' element={<h2>404 - Page not found</h2>} />
        </Routes>
      </ErrorBoundary>
    </Container>
  )
}

export default App
