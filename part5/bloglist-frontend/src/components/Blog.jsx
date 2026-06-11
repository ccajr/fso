const Blog = ({ blog, updateBlog, canDelete, deleteBlog }) => {
  if (!blog) {
    return null
  }

  const showWhenCanDelete = { display: canDelete ? '' : 'none' }

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
    <div>
      <h2>{blog.author}: {blog.title}</h2>
      <div>
        <a className='url' target="_blank" href={blog.url}>{blog.url}</a>
        <div>likes {blog.likes}{updateBlog && (
          <button onClick={handleLike}>like</button>
        )} </div>
        <div>Added by {blog.user.name}</div>
        <button onClick={handleRemove} style={showWhenCanDelete}>remove</button>
      </div>
    </div>
  )
}

export default Blog