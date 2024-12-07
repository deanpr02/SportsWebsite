import "./Login.css"
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
        <p>Login</p>
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
  