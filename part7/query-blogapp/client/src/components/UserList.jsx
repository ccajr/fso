import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material'
import { useEffect, useState } from 'react'
import userService from '../services/user'

const UserList = () => {
  const [users, setUsers] = useState(null)

  useEffect(() => {
    userService.getAll().then((data) => setUsers(data))
  }, [])

  if (!users) {
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
                <TableCell>{row.name}</TableCell>
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
