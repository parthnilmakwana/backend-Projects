
import './App.css'
import axios from 'axios'
import { useEffect, useState } from 'react'

function App() {
  const [data, setData] = useState([]);

  useEffect(() => {
    axios.get('/api/jokes')
      .then((response) => {
        console.log(response.data);
        setData(response.data);
      })
      .catch((error) => {
        console.error('Error fetching data from backend:', error);
      });
  },[])


  return (
    <>
      <h1>Hello from Frontend</h1>
      {data && data.map((joke)=>{
        return <div key={joke.id}>
          <h2>{joke.title}</h2>
          <p>{joke.content}</p>
        </div>
      })}
    </>
  )
}

export default App
