import './CreateUser.css'

import { useState } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { doc,setDoc } from 'firebase/firestore'
import { createUserWithEmailAndPassword } from "firebase/auth"
import { auth,db } from '../../firebase'

export default function CreateUser({setUserExists}){
  const navigate = useNavigate();  
  
  const [email,setEmail] = useState("");
  const [password,setPassword] = useState("");
  const [username,setUsername] = useState("");

  const saveUser = async (userID,username) => {
    const userRef = doc(db,'users',userID);
    try{
    await setDoc(userRef,{
      username:username
    })
    }
    catch(error){
      console.error('Error saving username:',error.message);
    }
  }

  const onSubmit = async (e) => {
    e.preventDefault()

    await createUserWithEmailAndPassword(auth,email,password)
      .then((userCredential) => {
        const user = userCredential.user;
        saveUser(user.uid,username);
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