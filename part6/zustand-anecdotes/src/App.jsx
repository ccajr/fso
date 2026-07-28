import { useEffect } from 'react'
import { useAnecdoteActions } from './store'
import { useNotification } from './notifStore'
import AnecdoteForm from './components/AnecdoteForm'
import AnecdoteList from './components/AnecdoteList'
import Notification from './components/Notification'
import Filter from './components/Filter'

const App = () => {
  const { initialize } = useAnecdoteActions()
  const message = useNotification()

  useEffect(() => {
    initialize()
  }, [initialize])

  return (
    <div>
      <Notification message={message} />
      <Filter />
      <h2>Anecdotes</h2>
      <AnecdoteList />
      <AnecdoteForm />
    </div>
  )
}

export default App