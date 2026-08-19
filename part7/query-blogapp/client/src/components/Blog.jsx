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
} from '@mui/material'
import { useNavigate } from 'react-router-dom'
import { useBlogs } from '../hooks/useBlogs'
import UserContext from '../UserContext'

const Blog = ({ blog }) => {
  const [confirmOpen, setConfirmOpen] = useState(false)
  const { like, removeBlog } = useBlogs()
  const navigate = useNavigate()
  const { user } = useContext(UserContext)

  if (!blog) {
    return <h2>404 - Page not found</h2>
  }

  const isCreator = user && blog.user.username === user.username

  const handleLike = () => {
    like(blog)
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
          gutterBottom
          sx={{ color: 'text.secondary' }}
        >
          Added by {blog.user.name}
        </Typography>
      </CardContent>
      <CardActions sx={{ marginLeft: 8 + 'px', marginTop: -16 + 'px' }}>
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
      </CardActions>

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
