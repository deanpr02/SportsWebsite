import './CreateUser.css'

import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

export default function CreateUser({setUserExists}){
  const navigate = useNavigate();  
  
  const [email,setEmail] = useState("");
  const [password,setPassword] = useState("");
  const [username,setUsername] = useState("");

  const onSubmit = async (e) => {
    e.preventDefault()

    try{
      const response = await fetch('/api/register',{
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials:'include',
        body: JSON.stringify({username,password})
      });

      const data = await response.json();
      
      if(response.ok){
        console.log('User successfully created')
        navigate('/home')
      }
      else{
        console.log(data.msg || 'Registration failure')
      }
    } catch(error) {
      console.error(error)
    }
    
}



    return(
        <>
        <div className="create-user-frame">
          <form action="">
            <h1>Create an account!</h1>
            <div className="input-box">
              <input type="text" placeholder="Enter your email" onChange={(e)=>setEmail(e.target.value)} required/>
              
            </div>
            <div className="input-box">
              <input type="password" placeholder="Enter your password" onChange={(e)=>setPassword(e.target.value)} required/>
            </div>
            <div className="input-box">
              <input type="text" placeholder="Enter your username" onChange={(e)=>setUsername(e.target.value)} required/>
            </div>

            <div className="remember-forgot">
              <label><input type="checkbox"/>Remember me</label>
              <a href="#">Forgot password?</a>
            </div>

            <button type="submit" onClick={onSubmit}>Create</button>

            <div className="login-link">
              <p>Already have an account? <a href="#" onClick={()=>setUserExists(true)}>Login</a></p>

            </div>
          </form>
        </div>
      </>
    )
}