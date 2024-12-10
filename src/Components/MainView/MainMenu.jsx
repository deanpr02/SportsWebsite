import './MainMenu.css'
import SportMenuContainer from './SportMenuContainer'
import Baseball from '../../assets/baseball.svg'
import Football from '../../assets/football.svg'
import Basketball from '../../assets/basketball.svg'
import Hockey from '../../assets/hockey.svg'
import Soccer from '../../assets/soccer.svg'

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