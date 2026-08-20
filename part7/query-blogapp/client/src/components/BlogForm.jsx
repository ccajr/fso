import { useNavigate } from 'react-router-dom'
import { TextField, Button } from '@mui/material'
import { useBlogs } from '../hooks/useBlogs'
import { useField } from '../hooks/useField'

const BlogForm = () => {
  const title = useField('text')
  const author = useField('text')
  const url = useField('text')
  const { addBlog } = useBlogs()
  const navigate = useNavigate()

  const handleAdd = (event) => {
    event.preventDefault()
    addBlog({
      title: title.value,
      author: author.value,
      url: url.value,
    })
    title.reset()
    author.reset()
    url.reset()
    navigate('/')
  }

  return (
    <form onSubmit={handleAdd} style={{ width: 50 + 'ch' }}>
      <h2>create new</h2>
      <div>
        <TextField
          label='title'
          {...title.inputProps}
          margin='dense'
          fullWidth
          size='small'
        />
      </div>
      <div>
        <TextField
          label='author'
          {...author.inputProps}
          margin='dense'
          fullWidth
          size='small'
        />
      </div>
      <div>
        <TextField
          label='url'
          {...url.inputProps}
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
