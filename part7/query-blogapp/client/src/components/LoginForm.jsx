import { Button, TextField } from '@mui/material'
import { useField } from '../hooks/useField'

const LoginForm = ({ doLogin }) => {
  const username = useField('text')
  const password = useField('password')

  const handleLogin = async (event) => {
    event.preventDefault()
    await doLogin({
      username: username.value,
      password: password.value,
    })
    username.reset()
    password.reset()
  }

  return (
    <form onSubmit={handleLogin}>
      <div>
        <h2>Log in to application</h2>
        <TextField
          label='username'
          variant='standard'
          {...username.inputProps}
        />
      </div>
      <div>
        <TextField
          label='password'
          variant='standard'
          {...password.inputProps}
        />
      </div>
      <Button type='submit' variant='contained' style={{ marginTop: 10 }}>
        login
      </Button>
    </form>
  )
}

export default LoginForm
