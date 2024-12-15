import './Bracket.css'
import Yankees from '../../assets/mlb-resources/mlb-yankees-primary.png'
import Orioles from '../../assets/mlb-resources/mlb-orioles-primary.png'
import Royals from '../../assets/mlb-resources/mlb-royals-primary.png'
import Tigers from '../../assets/mlb-resources/mlb-tigers-primary.png'
import Astros from '../../assets/mlb-resources/mlb-astros-primary.png'
import Guardians from '../../assets/mlb-resources/mlb-guardians-primary.png'
import Dodgers from '../../assets/mlb-resources/mlb-dodgers-primary.png'

export default function Bracket(){
    return(
        <>
        <div className="bracket-container">
            <Round/>

        </div>
        </>
    )
}

function Round(){
    const yanks = {name:"Yankees",city:"New York", logo:Yankees}
    const orioles = {name:"Orioles",city:"Baltimore",logo:Orioles}
    const royals = {name:"Royals",city:"Kansas City",logo:Royals}
    const tigers = {name:"Tigers",city:"Detroit",logo:Tigers}
    const astros = {name:"Astros",city:"Houston",logo:Astros}
    const guardians = {name:"Guardians",city:"Cleveland",logo:Guardians}
    return(
        <div className="round-container">
            <MatchUp away={tigers} home={astros}/>
            <MatchUp away={royals} home={orioles}/>
        </div>
    )
}

function MatchUp({home,away}){
    return(
        <div className="match-up">
            <Team teamCity={away.city} teamName={away.name} teamLogo={away.logo}/>
            <Team teamCity={home.city} teamName={home.name} teamLogo={home.logo}/>
        </div>
    )
}

function Team({teamCity,teamName,teamLogo}){
    return(
        <div className="team">
            <img className="team-logo" src={teamLogo} alt="Team Logo"></img>
            <div className="team-name">
            <p>{teamCity}</p>
            <p>{teamName}</p>
            </div>
            <p className="score">0</p>
        </div>
    )
}