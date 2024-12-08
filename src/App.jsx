import { useState } from 'react'
import './App.css'
import { useCityBackground } from './useCityBackground'
import BackgroundImage from './Components/LoginView/BackgroundImage'
import Login from './Components/LoginView/Login'

function App() {
  const [userExists,setUserExists] = useState(true)
  let randCity = useCityBackground()
  return (
    <>
      <BackgroundImage cityImg={randCity.city} starsImg={randCity.stars} cityName={randCity.name}/>
      {userExists ? <Login setUserExists={setUserExists}/>:
      <p>User exists</p>
      }
    </>
  )
}

export default App
