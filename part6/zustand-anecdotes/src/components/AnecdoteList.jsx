import { useAnecdotes, useAnecdoteActions } from '../store'
import { useNotificationActions } from '../notifStore'

const AnecdoteList = () => {
  const anecdotes = useAnecdotes()
  const { vote } = useAnecdoteActions()
  const { displayNotification } = useNotificationActions()

  const handleVote = (id, content) => {
    vote(id)
    displayNotification(`You voted '${content}'`)
  }

  return (
    <>
      {anecdotes.map(anecdote => (
        <div key={anecdote.id}>
          <div>{anecdote.content}</div>
          <div>
            has {anecdote.votes}
            <button onClick={() => handleVote(anecdote.id, anecdote.content)}>vote</button>
          </div>
        </div>
      ))}
    </>
  )
}

export default AnecdoteList