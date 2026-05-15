import { useState } from 'react'
const Blog = ({ blog, updateBlog, canDelete, deleteBlog }) => {
  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5
  }
  const [visible, setVisible] = useState(false)

  const showWhenVisible = { display: visible ? '' : 'none' }
  const showWhenCanDelete = { display: canDelete ? '' : 'none' }

  const toggleVisibility = () => {
    setVisible(!visible)
  }

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
    <div style={blogStyle}>
      <div>
        {blog.title} {blog.author}
        <button onClick={toggleVisibility}>{visible ? 'hide' : 'view'}</button>
        <div style={showWhenVisible}>
          <div>{blog.url}</div>
          <div>likes {blog.likes}<button onClick={handleLike}>like</button></div>
          <div>{blog.user.name}</div>
          <button onClick={handleRemove} style={showWhenCanDelete}>remove</button>
        </div>
      </div>
    </div>
  )
}

export default Blog