import "./BackgroundImage.css"

export default function BackgroundImage({cityImg,cityName}){
    return(
      <div className="login-background">
      <img className="city-background" src={cityImg}/>
      <p className="city-name">{cityName}</p>
      </div>
    )
  }