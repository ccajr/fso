import { Alert } from '@mui/material'
import useNotification from '../hooks/useNotification'

const Notification = () => {
  const { notification } = useNotification()

  if (notification === null) return null

  return (
    <Alert
      style={{ marginTop: 10, marginBottom: 10 }}
      severity={notification.type}
    >
      {notification.text}
    </Alert>
  )
}

export default Notification
