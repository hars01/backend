import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import axios from 'axios'
import { useEffect } from 'react'

function App() {
  const [jokes, setJokes] = useState([])

  useEffect(() => {
    axios.get('/api/jokes')
      .then(response => {
        setJokes(response.data)
      })
      .catch(error => {
        console.error('There was an error fetching the jokes!', error)
      })
  })

  return (
    <>
      <div>
        <h1>hiharsh</h1>
        <p>JOKES: {jokes.length}</p>

        {
        jokes.map((joke, index) => (
        <div key={index}>
          <p>{joke}</p>
        </div>
          ))
        }
      </div>
    </>
  )
}

export default App
