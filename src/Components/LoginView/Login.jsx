import './Login.css'
import { FaUser,FaLock } from 'react-icons/fa';
import { useState } from 'react'
import { signInWithEmailAndPassword } from 'firebase/auth'
import { auth } from '../../firebase'
import { useNavigate } from 'react-router-dom'

export default function Login({setUserExists}) {
    const navigate = useNavigate()
    const [email,setEmail] = useState("")
    const [password,setPassword] = useState("")

    const onLogin = (e) => {
      e.preventDefault()
      signInWithEmailAndPassword(auth,email,password)
        .then((userCredential) =>{
          const user = userCredential.user;
          navigate("/home")
        })
        .catch((error) =>{
          const errorCode = error.code;
          const errorMessage = error.message;
          console.log(errorCode,errorMessage);
        })
    }
  
  return (
      <>
        <div className="login-frame">
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

  