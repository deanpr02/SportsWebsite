import './MainMenu.css'
import { useNavigate,Routes,Route } from 'react-router-dom'
import SportMenuContainer from './SportMenuContainer'
import Baseball from '../../assets/menu-resources/mlb-logo.png'
import Football from '../../assets/menu-resources/nfl-logo.png'
import Basketball from '../../assets/menu-resources/nba-logo.png'
import Hockey from '../../assets/menu-resources/nhl-logo.png'
import Soccer from '../../assets/menu-resources/mls-logo.png'

export default function MainMenu(){
    const navigate = useNavigate()
    return(
        <div className="external-main">
            <div className="main-menu-container">
                <SportMenuContainer sportAbbr={"MLB"} sportName={"Major League Baseball"} sportImage={Baseball} navFunc={()=>navigate("./mlb")}/>
                <SportMenuContainer sportAbbr={"NFL"} sportName={"National Football League"} sportImage={Football} navFunc={()=>console.log("nfl")}/>
                <SportMenuContainer sportAbbr={"NBA"} sportName={"National Basketball Association"} sportImage={Basketball}/>
                <SportMenuContainer sportAbbr={"NHL"} sportName={"National Hockey League"} sportImage={Hockey}/>
                <SportMenuContainer sportAbbr={"MLS"} sportName={"Major League Soccer"} sportImage={Soccer}/>
            </div>
        </div>
    )
}