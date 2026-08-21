import { useEffect, useContext } from 'react'
import { Routes, Route, Link, useNavigate, useMatch } from 'react-router-dom'
import { Container, AppBar, Button, Toolbar, Typography } from '@mui/material'
import Blog from './components/Blog'
import BlogForm from './components/BlogForm'
import Notification from './components/Notification'
import ErrorBoundary from './components/ErrorBoundary'
import User from './components/User'
import UserList from './components/UserList'
import BlogList from './components/BlogList'
import LoginForm from './components/LoginForm'
import blogService from './services/blogs'
import loginService from './services/login'
import persistentUser from './services/persistentUser'
import useNotification from './hooks/useNotification'
import { useBlogs } from './hooks/useBlogs'
import { useUsers } from './hooks/useUsers'
import UserContext from './UserContext'

const App = () => {
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
    setLoginUser(null)
  }

  const handleLogin = async (credentials) => {
    try {
      const user = await loginService.login(credentials)
      persistentUser.saveUser(user)
      blogService.setToken(user.token)
      setLoginUser(user)
      navigate('/')
    } catch {
      notify('wrong username or password', 'error')
    }
  }

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
          <Route path='/' element={<BlogList blogs={blogs} />} />
          <Route path='/blogs/:id' element={<Blog blog={blog} />} />
          <Route path='/users' element={<UserList />} />
          <Route
            path='/users/:id'
            element={<User user={user} isPending={userIsPending} />}
          />
          <Route path='/create' element={loginUser && <BlogForm />} />
          <Route
            path='/login'
            element={!loginUser && <LoginForm doLogin={handleLogin} />}
          />
          <Route path='*' element={<h2>404 - Page not found</h2>} />
        </Routes>
      </ErrorBoundary>
    </Container>
  )
}

export default App
