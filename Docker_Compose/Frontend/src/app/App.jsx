import React, { useEffect, useState } from 'react'
import axios from 'axios'
import './App.css'

const App = () => {
  const [users, setUsers] = useState([])

  useEffect(()=>{
    axios.get('/api/user')
    .then((response)=>{
      setUsers(response.data)
      console.log(response.data)
    })
  },[])
  return (
    <div>
    <h1>Users</h1>
      <ul>
        {users.map((user)=>{
          return <li key={user.id}>{user.name}</li>
        })}
      </ul>
    </div>
  )
}

export default App