import { useState, useEffect, useRef } from 'react'
import {
  Routes, Route, Link, useNavigate
} from 'react-router-dom'
import Blog from './components/Blog'
import BlogForm from './components/BlogForm'
import BlogList from './components/BlogList'
import Notification from './components/Notification'
import blogService from './services/blogs'
import loginService from './services/login'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)
  const [newMessage, setNewMessage] = useState(null)
  const blogFormRef = useRef()
  const navigate = useNavigate()

  useEffect(() => {
    blogService.getAll().then(blogs =>
      setBlogs( blogs.sort((a, b) => b.likes - a.likes) )
    )
  }, [])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogAppUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

  const displayNotification = (message, isError) => {
    setNewMessage({
      content: message,
      isError: isError
    })

    setTimeout(() => {
      setNewMessage(null)
    }, 5000)
  }

  const handleLogout = () => {
    window.localStorage.removeItem('loggedBlogAppUser')
    setUsername('')
    setPassword('')
    setUser(null)
  }

  const handleLogin = async event => {
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
      displayNotification('wrong username or password', true)
    }
  }

  const loginForm = () => (
    <form onSubmit={handleLogin}>
      <div>
        <h2>log in to application</h2>
        <Notification message={newMessage} />
        <label>
          username
          <input
            type="text"
            value={username}
            onChange={({ target }) => setUsername(target.value)}
          />
        </label>
      </div>
      <div>
        <label>
          password
          <input
            type="password"
            value={password}
            onChange={({ target }) => setPassword(target.value)}
          />
        </label>
      </div>
      <button type="submit">login</button>
    </form>
  )

  const createBlog = async blogObject => {
    blogFormRef.current.toggleVisibility()
    const blog = await blogService.create(blogObject)
    setBlogs(blogs.concat(blog))
    displayNotification(`a new blog ${blog.title} by ${blog.author} added`, false)
  }

  const updateBlog = async (id, blogObject) => {
    const updatedBlog = await blogService.update(id, blogObject)
    setBlogs(blogs
      .map(blog => blog.id === id ? updatedBlog : blog)
      .sort((a, b) => b.likes - a.likes))
  }

  const deleteBlog = async id => {
    await blogService.remove(id)
    setBlogs(blogs.filter(blog => blog.id !== id))
  }

  const blogForm = () => (
    <Togglable buttonLabel="create new blog" ref={blogFormRef}>
      <BlogForm createBlog={createBlog} />
    </Togglable>
  )

  const padding = {
    padding: 5
  }

  return (
    <div>
      <div>
        <Link style={padding} to="/">blogs</Link>
        {!user && (
          <Link style={padding} to="/login">login</Link>
        )}
        {user && (
          <button onClick={handleLogout}>logout</button>
        )}
      </div>

      <Routes>
        <Route path="/" element={
          <BlogList blogs={blogs} />
        } />
        <Route path="/login" element={loginForm()} />
      </Routes>
    </div>
  )
}

export default App