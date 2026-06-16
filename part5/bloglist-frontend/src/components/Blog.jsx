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
    <div>
      <h2>{blog.author}: {blog.title}</h2>
      <div>
        <a className='url' target="_blank" href={blog.url}>{blog.url}</a>
        <div>
          likes {blog.likes}
          {user && <button onClick={handleLike}>like</button>}
        </div>
        <div>Added by {blog.user.name}</div>
        {isCreator && <button onClick={handleRemove}>remove</button>}
      </div>
    </div>
  )
}

export default Blog