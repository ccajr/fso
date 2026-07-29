import { useAnecdotes, useAnecdoteActions } from '../store'
import { useNotificationActions } from '../notifStore'

const AnecdoteList = () => {
  const anecdotes = useAnecdotes()
  const { vote, remove } = useAnecdoteActions()
  const { displayNotification } = useNotificationActions()

  const handleVote = (id, content) => {
    vote(id)
    displayNotification(`You voted '${content}'`)
  }

  const handleRemove = (id, content) => {
    remove(id)
    displayNotification(`You removed '${content}'`)
  }

  return (
    <>
      {anecdotes.map(anecdote => (
        <div key={anecdote.id}>
          <div>{anecdote.content}</div>
          <div>
            has {anecdote.votes}
            <button onClick={() => handleVote(anecdote.id, anecdote.content)}>vote</button>
            {anecdote.votes === 0 && (
              <button onClick={() => handleRemove(anecdote.id, anecdote.content)}>remove</button>
            )}
          </div>
        </div>
      ))}
    </>
  )
}

export default AnecdoteList