import './CreateUser.css'

export default function CreateUser({setUserExists}){
    return(
        <>
        <div className="create-user-frame">
          <form action="">
            <h1>Create an account!</h1>
            <div className="input-box">
              <input type="text" placeholder="Username" required/>
              
            </div>
            <div className="input-box">
              <input type="password" placeholder="Password" required/>
              
            </div>

            <div className="remember-forgot">
              <label><input type="checkbox"/>Remember me</label>
              <a href="#">Forgot password?</a>
            </div>

            <button type="submit">Create</button>

            <div className="login-link">
              <p>Already have an account? <a href="#" onClick={()=>setUserExists(true)}>Login</a></p>

            </div>
          </form>
        </div>
      </>
    )
}