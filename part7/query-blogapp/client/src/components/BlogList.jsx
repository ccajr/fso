import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
} from '@mui/material'
import { Link } from 'react-router-dom'

const BlogList = ({ blogs }) => {
  return (
    <div>
      <h2>Blogs</h2>
      <TableContainer sx={{ maxWidth: 600 }}>
        <Table size='small'>
          <TableBody>
            {blogs
              ?.toSorted((a, b) => b.likes - a.likes)
              .map((blog) => (
                <TableRow key={blog.id}>
                  <TableCell>
                    <Link to={`/blogs/${blog.id}`}>
                      {blog.title} by {blog.author}
                    </Link>
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  )
}

export default BlogList
