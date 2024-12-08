import "./Login.css"
import { FaUser,FaLock } from 'react-icons/fa';
import { createUserWithEmailAndPassword } from "firebase/auth"


import NewYorkImage from "../../assets/login-resources/newyork/newyork-skyline.jpg"
import NewYorkStars from "../../assets/login-resources/newyork/stars-ny.png"

function useCityBackground() {
  let cityList = [
    {"name":"New York","city":NewYorkImage,"stars":NewYorkStars}
  ];

  let randInt = Math.floor(Math.random() * ((cityList.length - 1) + 1));
  return cityList[randInt]
}


export default function Login() {
    let randCity = useCityBackground()
    return (
      <>
        <BackgroundImage cityImg={randCity.city} starsImg={randCity.stars} cityName={randCity.name}/>
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
              <p>Dont have an account? <a href="#">Register</a></p>

            </div>
          </form>
        </div>
      </>
    )
  }


  function BackgroundImage({cityImg,starsImg,cityName}){
    return(
      <div className="login-background">
      <img className="city-background" src={cityImg}/>
      <img className="stars-background" src={starsImg}/>
      <p className="city-name">{cityName}</p>
      </div>
    )
  }
  