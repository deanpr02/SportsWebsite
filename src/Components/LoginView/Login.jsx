import "./Login.css"

function useCityBackground() {
  let cityList = [
    ['newyork-skyline.png','stars-ny.png']
  ];

  let randInt = Math.floor(Math.random() * ((cityList.length - 1) + 1));
  return cityList[randInt]
}


export default function Login() {
    return (
      <>
      <div className="login-background"></div>
      <div className="stars"></div>
        <p>Login</p>
      </>
    )
  }
  