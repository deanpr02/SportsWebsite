import './Login.css'
import { FaUser,FaLock } from 'react-icons/fa';
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

export default function Login({setUserExists}) {
    const navigate = useNavigate()
    const [email,setEmail] = useState("")
    const [password,setPassword] = useState("")


    const delay = (ms) => {
      return new Promise(resolve => setTimeout(resolve, ms));
    }

    const showWrongPassword = async () => {
      const loginFrame = document.getElementById('login-frame');
      const previousStyle = loginFrame.style.cssText;
      loginFrame.style.backgroundColor = 'red';
      loginFrame.style.animation = 'shake 0.5s';
      await delay(500);
      loginFrame.style = previousStyle;
    }

    const onLogin = async (e) => {
      e.preventDefault()

        const response = await fetch('/api/login',{
        method: "POST",
        headers: {"Content-Type": "application/json"},
        credentials:"include",
        body: JSON.stringify({"username":email,"password":password}),
      })

      if(response.ok){
        navigate("/home")
      }else{
        showWrongPassword()
      }
    }
  
  return (
      <>
        <div className="login-frame" id="login-frame">
          <form action="">
            <h1>Welcome!</h1>
            <div className="input-box">
              <input type="text" placeholder="Username" onChange={(e)=>setEmail(e.target.value)} required/>
              <FaUser className="icon"/>
            </div>
            <div className="input-box">
              <input type="password" placeholder="Password" onChange={(e)=>setPassword(e.target.value)} required/>
              <FaLock className="icon"/>
            </div>

            <div className="remember-forgot">
              <label><input type="checkbox"/>Remember me</label>
              <a href="#">Forgot password?</a>
            </div>

            <button type="submit" onClick={onLogin}>Login</button>

            <div className="register-link">
              <p>Dont have an account? <a href="#" onClick={()=>setUserExists(false)}>Register</a></p>

            </div>
          </form>
        </div>
      </>
    )
  }

  