import Blog from './Blog'
import { Link } from 'react-router-dom'

const BlogList = ({ blogs }) => {

  return (
    <div>
      <div>
        <h2>blogs</h2>
        <ul>
          {blogs.map(blog =>
            <li key={blog.id}>
              <Link to={`/blogs/${blog.id}`}>{blog.title} {blog.author}</Link>
            </li>
          )}
        </ul>
      </div>
    </div>
  )
}

export default BlogList