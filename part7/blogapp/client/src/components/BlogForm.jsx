import { useState } from 'react'
import { TextField, Button } from '@mui/material'

const BlogForm = ({ createBlog }) => {
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [url, setUrl] = useState('')

  const addBlog = (event) => {
    event.preventDefault()
    createBlog({ title, author, url })
    setTitle('')
    setAuthor('')
    setUrl('')
  }

  return (
    <form onSubmit={addBlog} style={{ width: 50 + 'ch' }}>
      <h2>create new</h2>
      <div>
        <TextField
          label='title'
          type="text"
          value={title}
          onChange={({ target }) => setTitle(target.value)}
          margin='dense' fullWidth size='small'
        />
      </div>
      <div>
        <TextField
          label='author'
          type="text"
          value={author}
          onChange={({ target }) => setAuthor(target.value)}
          margin='dense' fullWidth size='small'
        />
      </div>
      <div>
        <TextField
          label='url'
          type="text"
          value={url}
          onChange={({ target }) => setUrl(target.value)}
          margin='dense' fullWidth size='small'
        />
      </div>
      <Button type="submit" variant='contained' style={{ marginTop: 10 }}>create</Button>
    </form>
  )
}

export default BlogForm