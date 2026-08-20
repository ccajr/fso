import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material'
import { useUsers } from '../hooks/useUsers'
import { Link } from 'react-router-dom'

const UserList = () => {
  const { users, isPending } = useUsers()

  if (isPending || !users) {
    return null
  }

  const style = { fontWeight: 'bold' }

  return (
    <div>
      <h2>Users</h2>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell sx={style}>Name</TableCell>
              <TableCell sx={style}>Username</TableCell>
              <TableCell sx={style}>Blogs created</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users?.map((row) => (
              <TableRow key={row.id}>
                <TableCell>
                  <Link to={'/users/' + row.id}>{row.name}</Link>
                </TableCell>
                <TableCell>{row.username}</TableCell>
                <TableCell>{row.blogs.length}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  )
}

export default UserList
