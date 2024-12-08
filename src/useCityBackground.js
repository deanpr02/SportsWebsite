import NewYorkImage from "./assets/login-resources/newyork/newyork-skyline.jpg"
import NewYorkStars from "./assets/login-resources/newyork/stars-ny.png"

export function useCityBackground() {
  let cityList = [
    {"name":"New York","city":NewYorkImage,"stars":NewYorkStars}
  ];

  let randInt = Math.floor(Math.random() * ((cityList.length - 1) + 1));
  return cityList[randInt]
}
