import "./Login.css"
import { FaUser,FaLock } from 'react-icons/fa';
import { createUserWithEmailAndPassword } from "firebase/auth"

export default function Login({setUserExists}) {
    return (
      <>
        <div className="login-frame">
          <form action="">
            <h1>Welcome!</h1>
            <div className="input-box">
              <input type="text" placeholder="Username" required/>
              <FaUser className="icon"/>
            </div>
            <div className="input-box">
              <input type="password" placeholder="Password" required/>
              <FaLock className="icon"/>
            </div>

            <div className="remember-forgot">
              <label><input type="checkbox"/>Remember me</label>
              <a href="#">Forgot password?</a>
            </div>

            <button type="submit">Login</button>

            <div className="register-link">
              <p>Dont have an account? <a href="#" onClick={()=>setUserExists(false)}>Register</a></p>

            </div>
          </form>
        </div>
      </>
    )
  }

  