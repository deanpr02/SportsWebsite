import './MainMenu.css'
import SportMenuContainer from './SportMenuContainer'
import Baseball from '../../assets/menu-resources/mlb-logo.png'
import Football from '../../assets/menu-resources/nfl-logo.png'
import Basketball from '../../assets/menu-resources/nba-logo.png'
import Hockey from '../../assets/menu-resources/nhl-logo.png'
import Soccer from '../../assets/menu-resources/mls-logo.png'

export default function MainMenu(){
    return(
        <>
        <div className="main-menu-container">
            <div className="menu-row">
                <SportMenuContainer sportName={"MLB"} sportImage={Baseball}/>
                <SportMenuContainer sportName={"NFL"} sportImage={Football}/>
            </div>
            <div className="menu-row">
                <SportMenuContainer sportName={"NBA"} sportImage={Basketball}/>
                <SportMenuContainer sportName={"NHL"} sportImage={Hockey}/>
            </div>
            <div className="menu-row">
                <SportMenuContainer sportName={"MLS"} sportImage={Soccer}/>
                <SportMenuContainer sportName={"MLS"} sportImage={Soccer}/>
            </div>
        </div>
        </>
    )
}