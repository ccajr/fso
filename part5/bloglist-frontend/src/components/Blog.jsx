import { Button, Card, CardActionArea, CardContent, CardActions, Typography } from '@mui/material'
const Blog = ({ blog, updateBlog, user, deleteBlog }) => {
  if (!blog) {
    return null
  }

  const isCreator = user && blog.user.username === user.username

  const handleLike = () => {
    updateBlog(blog.id, {
      user: blog.user.id,
      likes: blog.likes + 1,
      author: blog.author,
      title: blog.title,
      url: blog.url
    })
  }

  const handleRemove = () => {
    if (window.confirm(`Remove blog ${blog.title} by ${blog.author}`)) {
      deleteBlog(blog.id)
    }
  }

  return (
    <Card>
      <CardContent>
        <Typography variant='h5' component='div'>{blog.title}</Typography>
        <Typography variant='body1' sx={{ color: 'text.secondary' }}>by {blog.author}</Typography>
        <Typography variant='body2' component='a' className='url' target="_blank" href={blog.url} >{blog.url}</Typography>
        <Typography variant='body2' sx={{ color: 'text.secondary' }}>Added by {blog.user.name}</Typography>
      </CardContent>
      <CardActions sx={{ marginLeft: 8 + 'px', marginTop: -16 + 'px' }}>
        <Typography variant='body1'>{blog.likes} likes</Typography>
        {user && <Button variant='outlined' size='small' onClick={handleLike}>like</Button>}
        {isCreator && <Button variant='outlined' size='small' color='error' onClick={handleRemove}>remove</Button>}
      </CardActions>
    </Card>
  )
}

export default Blog