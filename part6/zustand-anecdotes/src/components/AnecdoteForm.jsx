import { useAnecdoteActions } from '../store'
import { useNotificationActions } from '../notifStore'

const AnecdoteForm = () => {
  const { add } = useAnecdoteActions()
  const { displayNotification } = useNotificationActions()

  const addAnecdote = (e) => {
    e.preventDefault()
    const content = e.target.anecdote.value
    add(content)
    displayNotification(`'${content}' added`)
    e.target.reset()
  }

  return (
    <>
      <h2>create new</h2>
      <form onSubmit={addAnecdote}>
        <div>
          <input name='anecdote'/>
        </div>
        <button type='submit'>create</button>
      </form>
    </>
  )
}

export default AnecdoteForm