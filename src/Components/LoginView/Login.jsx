import "./Login.css"
import NewYorkImage from "../../assets/login-resources/newyork/newyork-skyline.jpg"
import NewYorkStars from "./stars-ny.png"

function useCityBackground() {
  let cityList = [
    {"name":"New York","city":NewYorkImage,"stars":NewYorkStars}
  ];

  let randInt = Math.floor(Math.random() * ((cityList.length - 1) + 1));
  return cityList[randInt]
}


export default function Login() {
    return (
      <>
      <img className="city-background" src={NewYorkImage}/>
      <div className="stars"></div>
        <p className="city-name">New York</p>
        <p>Login</p>
      </>
    )
  }


  function BackgroundImage({cityImg,starsImg}){
    return(
      <div className="login-background">
      <img className="city-background" src={cityImg}/>
      <img className="stars-background" src={starsImg}/>
      <p></p>
      </div>
    )
  }
  