import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { TextField, Button } from '@mui/material'
import { useBlogs } from '../hooks/useBlogs'

const BlogForm = () => {
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [url, setUrl] = useState('')
  const { addBlog } = useBlogs()
  const navigate = useNavigate()

  const handleAdd = (event) => {
    event.preventDefault()
    addBlog({ title, author, url })
    setTitle('')
    setAuthor('')
    setUrl('')
    navigate('/')
  }

  return (
    <form onSubmit={handleAdd} style={{ width: 50 + 'ch' }}>
      <h2>create new</h2>
      <div>
        <TextField
          label='title'
          type='text'
          value={title}
          onChange={({ target }) => setTitle(target.value)}
          margin='dense'
          fullWidth
          size='small'
        />
      </div>
      <div>
        <TextField
          label='author'
          type='text'
          value={author}
          onChange={({ target }) => setAuthor(target.value)}
          margin='dense'
          fullWidth
          size='small'
        />
      </div>
      <div>
        <TextField
          label='url'
          type='text'
          value={url}
          onChange={({ target }) => setUrl(target.value)}
          margin='dense'
          fullWidth
          size='small'
        />
      </div>
      <Button type='submit' variant='contained' style={{ marginTop: 10 }}>
        create
      </Button>
    </form>
  )
}

export default BlogForm
