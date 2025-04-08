import NewYorkImage from './assets/login-resources/newyork-skyline.jpg'
import BostonImage from './assets/login-resources/boston-skyline.jpg'
import PhiladelphiaImage from './assets/login-resources/philadelphia-skyline.jpg'
import LAImage from './assets/login-resources/la-skyline.jpg'
import SFImage from './assets/login-resources/sf-skyline.jpg'
import DenverImage from './assets/login-resources/denver-skyline.jpg'
import MiamiImage from './assets/login-resources/miami-skyline.jpg'
import DallasImage from './assets/login-resources/dallas-skyline.jpg'
import HoustonImage from './assets/login-resources/houston-skyline.jpg'
import ClevelandImage from './assets/login-resources/cleveland-skyline.jpg'
import ChicagoImage from './assets/login-resources/chicago-skyline.jpg'
import SeattleImage from './assets/login-resources/seattle-skyline.jpg'
import MinneapolisImage from './assets/login-resources/minneapolis-skyline.jpg'
import AtlantaImage from './assets/login-resources/atlanta-skyline.jpg'
import TampaImage from './assets/login-resources/tampa-skyline.jpg'
import BaltimoreImage from './assets/login-resources/baltimore-skyline.jpg'
import PittsburghImage from './assets/login-resources/pittsburgh-skyline.jpg'
import CincinnatiImage from './assets/login-resources/cincinnati-skyline.jpg'
import PhoenixImage from './assets/login-resources/phoenix-skyline.jpg'
import PortlandImage from './assets/login-resources/portland-skyline.jpg'
import UtahImage from './assets/login-resources/utah-skyline.jpg'
import TorontoImage from './assets/login-resources/toronto-skyline.jpg'
import NewOrleansImage from './assets/login-resources/neworleans-skyline.jpg'
import DetroitImage from './assets/login-resources/detroit-skyline.jpg'
import VegasImage from './assets/login-resources/vegas-skyline.jpg'
import KansasCityImage from './assets/login-resources/kansascity-skyline.jpg'
import StLouisImage from './assets/login-resources/stlouis-skyline.jpg'
import MilwaukeeImage from './assets/login-resources/milwaukee-skyline.jpg'

export function useCityBackground() {
  let cityList = [
    {"name":"New York City, NY","img":NewYorkImage,
      "teams":["Yankees","Mets","Giants","Jets","Knicks","Nets"]},
    {"name":"Boston, MA","img":BostonImage,
      "teams":["Red Sox","Celtics","Patriots"]},
    {"name":"Philadelphia, PA","img":PhiladelphiaImage,
      "teams":["Phillies","76ers","Eagles"]},
    {"name":"Los Angeles, CA","img":LAImage,
      "teams":["Dodgers","Angels","Lakers","Clippers","Rams","Chargers"]},
    {"name":"San Francisco, CA","img":SFImage,
      "teams":["Giants","49ers","Warriors"]},
    {"name":"Denver, CO","img":DenverImage,
      "teams":["Rockies","Nuggets","Broncos"]},
    {"name":"Miami, FL","img":MiamiImage,
      "teams":["Marlins","Heat","Dolphins"]},
    {"name":"Dallas, TX","img":DallasImage,
      "teams":["Rangers","Mavericks","Cowboys"]},
    {"name":"Houston, TX","img":HoustonImage,
      "teams":["Astros","Rockets","Texans"]},
    {"name":"Cleveland, OH","img":ClevelandImage,
      "teams":["Guardians","Cavaliers","Browns"]},
    {"name":"Chicago, IL","img":ChicagoImage,
      "teams":["Cubs","White Sox","Bulls","Bears"]},
    {"name":"Seattle, WA","img":SeattleImage,
      "teams":["Mariners","Seahawks"]},
    {"name":"Minneapolis, MN","img":MinneapolisImage,
      "teams":["Twins","Timberwolves","Vikings"]},
    {"name":"Atlanta, GA","img":AtlantaImage,
      "teams":["Braves","Hawks","Falcons"]},
    {"name":"Tampa Bay, FL","img":TampaImage,
      "teams":["Rays","Buccaneers"]},
    {"name":"Baltimore, MD","img":BaltimoreImage,
      "teams":["Orioles","Ravens"]},
    {"name":"Pittsburgh, PA","img":PittsburghImage,
      "teams":["Pirates","Steelers"]},
    {"name":"Cincinnati, OH","img":CincinnatiImage,
      "teams":["Reds","Bengals"]},
    {"name":"Phoenix, AZ","img":PhoenixImage,
      "teams":["Diamondbacks","Suns","Cardinals"]},
    {"name":"Portland, OR","img":PortlandImage,
      "teams":["Trailblazers"]},
    {"name":"Salt Lake City, UT","img":UtahImage,
      "teams":["Jazz"]},
    {"name":"Toronto, ON","img":TorontoImage,
    "teams":["Blue Jays","Raptors"]},
    {"name":"New Orleans, LA","img":NewOrleansImage,
      "teams":["Pelicans","Saints"]},
    {"name":"Detroit, MI","img":DetroitImage,
      "teams":["Tigers","Pistons","Lions"]},
    {"name":"Las Vegas, NV","img":VegasImage,
      "teams":["Athletics","Raiders"]},
    {"name":"Kansas City, MO","img":KansasCityImage,
      "teams":["Royals","Chiefs"]},
    {"name":"St. Louis, MO","img":StLouisImage,
      "teams":["Cardinals"]},
    {"name":"Milwaukee, WI","img":MilwaukeeImage,
      "teams":["Brewers","Bucks"]}
  ];

  let randInt = Math.floor(Math.random() * ((cityList.length - 1) + 1));
  return cityList[randInt]
}
