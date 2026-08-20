const User = ({ user, isPending }) => {
  if (isPending) {
    return null
  }

  if (!user) {
    return <h2>404 - Page not found</h2>
  }

  return (
    <div>
      <h2>{user.name}</h2>
      <h2>added blogs</h2>
      <ul>
        {user.blogs.map((blog) => (
          <li key={blog.id}>{blog.title}</li>
        ))}
      </ul>
    </div>
  )
}

export default User
