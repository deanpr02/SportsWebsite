export default function BackgroundImage({cityImg,starsImg,cityName}){
    return(
      <div className="login-background">
      <img className="city-background" src={cityImg}/>
      <img className="stars-background" src={starsImg}/>
      <p className="city-name">{cityName}</p>
      </div>
    )
  }