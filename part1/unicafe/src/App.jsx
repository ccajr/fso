import { useState } from 'react'

const Button = ({ onClick, text }) => { 
    return (
      <button onClick={onClick}>
        {text}
      </button>
    )
}

const App = () => {
  // save clicks of each button to its own state
  const [good, setGood] = useState(0)
  const [neutral, setNeutral] = useState(0)
  const [bad, setBad] = useState(0)
  const [total, setTotal] = useState(0)
  const [average, setAverage] = useState(0)
  const [positive, setPositive] = useState(0)

  const computeOverall = (pos, neg) => {
    const count = total + 1;
    setTotal(count)
    setAverage((pos - neg) / count)
    setPositive( (pos * 100) / count )
  }

  const handleGood = () => {
    const val = good + 1
    setGood(val)
    computeOverall(val, bad)
  }

  const handleNeutral = () => {
    setNeutral(neutral + 1)
    computeOverall(good, bad)
  }

  const handleBad = () => {
    const val = bad + 1
    setBad(val)
    computeOverall(good, val)
  }

  return (
    <div>
      <h1>give feedback</h1>
      <Button onClick={handleGood} text="good" />
      <Button onClick={handleNeutral} text="neutral" />
      <Button onClick={handleBad} text="bad" />
      <h1>statistics</h1>
      <p>
        good {good}<br/>
        neutral {neutral}<br/>
        bad {bad}<br/>
        all {total}<br/>
        average {average}<br/>
        positive {positive} %
      </p>
    </div>
  )
}

export default App