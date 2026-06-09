import Blog from './Blog'

const BlogList = ({ blogs }) => {

  return (
    <div>
      <div>
        <h2>blogs</h2>
        {blogs.map(blog =>
          <Blog key={blog.id} blog={blog} />
        )}
      </div>
    </div>
  )
}

export default BlogList