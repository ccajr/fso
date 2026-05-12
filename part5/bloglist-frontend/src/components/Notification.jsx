const Notification = ({ message }) => {
  if (!message) {
    return null
  }

  return (
    <div className={message.isError ? 'error' : 'success'}>
      {message.content}
    </div>
  )
}

export default Notification