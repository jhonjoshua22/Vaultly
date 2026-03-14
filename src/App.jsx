import { useState } from 'react'

function App() {
  const [count, setCount] = useState(0)

  return (
    <div style={{ textAlign: 'center', marginTop: '50px', fontFamily: 'Arial' }}>
      <h1>Welcome to my GitHub React Site</h1>
      <p>I built this using VS Code!</p>
      
      <div style={{ padding: '20px', border: '1px solid #ddd', borderRadius: '8px', display: 'inline-block' }}>
        <p>Current Count: {count}</p>
        <button onClick={() => setCount(count + 1)}>
          Click Me
        </button>
      </div>
    </div>
  )
}

export default App
