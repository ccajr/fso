import { useContext, useState } from 'react'
import {
  Button,
  Card,
  CardContent,
  CardActions,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Link,
  TextField,
  Box,
} from '@mui/material'
import { useNavigate } from 'react-router-dom'
import { useBlogs } from '../hooks/useBlogs'
import { useField } from '../hooks/useField'
import UserContext from '../UserContext'

const Blog = ({ blog }) => {
  const [confirmOpen, setConfirmOpen] = useState(false)
  const { like, removeBlog, isPending, addComment } = useBlogs()
  const navigate = useNavigate()
  const { user } = useContext(UserContext)
  const comment = useField('text')

  if (isPending) {
    return null
  }

  if (!blog) {
    return <h2>404 - Page not found</h2>
  }

  const isCreator = user && blog.user.username === user.username

  const handleLike = () => {
    like(blog)
  }

  const handleAddComment = (event) => {
    event.preventDefault()
    addComment({ id: blog.id, commentObject: { content: comment.value } })
    comment.reset()
  }

  const handleRemove = () => {
    removeBlog(blog)
    setConfirmOpen(false)
    navigate('/')
  }

  return (
    <Card sx={{ mt: 2, maxWidth: 600 }}>
      <CardContent>
        <Typography variant='h5' component='div'>
          {blog.title}
        </Typography>
        <Typography variant='subtitle1' sx={{ color: 'text.secondary' }}>
          by {blog.author}
        </Typography>
        <Link
          href={blog.url}
          target='_blank'
          rel='noopener'
          display='block'
          sx={{ mb: 1 }}
        >
          {blog.url}
        </Link>
        <Typography
          variant='body2'
          sx={{ color: 'text.secondary', marginTop: 6 + 'px' }}
        >
          Added by {blog.user.name}
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 1 }}>
          <Typography variant='body1'>{blog.likes} likes</Typography>
          {user && (
            <Button variant='outlined' size='small' onClick={handleLike}>
              like
            </Button>
          )}
          {isCreator && (
            <Button
              variant='outlined'
              size='small'
              color='error'
              onClick={() => setConfirmOpen(true)}
            >
              remove
            </Button>
          )}
        </Box>
        <br />
        <Typography variant='h6'>comments</Typography>
        <form onSubmit={handleAddComment}>
          <div style={{ display: 'flex' }}>
            <TextField
              label='add a comment'
              size='small'
              {...comment.inputProps}
              sx={{ marginRight: 8 + 'px' }}
            ></TextField>
            <Button variant='contained' size='medium' type='submit'>
              add comment
            </Button>
          </div>
        </form>
        <ul>
          {blog.comments.map((comment) => (
            <li key={comment.id}>{comment.content}</li>
          ))}
        </ul>
      </CardContent>

      <Dialog open={confirmOpen} onClose={() => setConfirmOpen(false)}>
        <DialogTitle>Remove blog</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Remove blog <strong>{blog.title}</strong> by {blog.author}?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmOpen(false)}>cancel</Button>
          <Button onClick={handleRemove} color='error' variant='contained'>
            remove
          </Button>
        </DialogActions>
      </Dialog>
    </Card>
  )
}

export default Blog
