import { useState } from 'react'
import './App.css'
import { useCityBackground } from './useCityBackground'
import BackgroundImage from './Components/LoginView/BackgroundImage'
import Login from './Components/LoginView/Login'
import CreateUser from './Components/LoginView/CreateUser'

function App() {
  const [userExists,setUserExists] = useState(true)
  let randCity = useCityBackground()
  return (
    <>
    {randCity &&
    <div className='login-page-container' style={{backgroundImage:`url(${randCity.img})`}}>
      {userExists ? <Login setUserExists={setUserExists}/>:
      <CreateUser setUserExists={setUserExists}/>
      }
      <Information name={randCity.name} teams={randCity.teams}/>
    </div>
    }
    </>
  )
}

function Information({name,teams}){
  const [hovered,setHovered] = useState(false);
  return(
    <div className='information-container'>
      <p className='city-name'>
        {name}
      </p>
      <div className='city-team-information'>
        <p style={{border: '2px solid white',borderRadius:'100px',padding:'3px 13px 3px 13px',zIndex:2}} onMouseEnter={() => setHovered(true)} onMouseLeave={()=>setHovered(false)}>i</p>
        {hovered &&
        <>
        <div className='city-team-arrow'></div>
        <div className='city-team-display'>
          <p>Home of the</p>
          <div style={{display:'flex',flexDirection:'row'}}>
          {teams.map(team => {
            return <p style={{paddingRight:'5px'}}>{team} /</p>
          })}
          </div>
        </div>
        </>
        }
      </div>
    </div>
  )
}

export default App;
