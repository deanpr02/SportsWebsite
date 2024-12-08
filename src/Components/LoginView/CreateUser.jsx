import './CreateUser.css'

import { useState } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { createUserWithEmailAndPassword } from "firebase/auth"
import { auth } from '../../firebase'

export default function CreateUser({setUserExists}){
  const navigate = useNavigate();  
  
  const [email,setEmail] = useState("");
  const [password,setPassword] = useState("");

  const onSubmit = async (e) => {
    e.preventDefault()

    await createUserWithEmailAndPassword(auth,email,password)
      .then((userCredential) => {
        const user = userCredential.user;
        navigate("/home");

      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.log(errorCode,errorMessage);
      });
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