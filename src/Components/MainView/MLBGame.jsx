import { useState } from 'react'
import { useRetrieveTeam } from '../../Hooks/useRetrieveTeam'
import './MLBGame.css'
import StadiumCloud from "./StadiumCloud"

export default function MLBGame({home,away}){
    const homeTeamInfo = useRetrieveTeam(home);
    const awayTeamInfo = useRetrieveTeam(away);

    return(
        <div className='mlb-game-container'>
            <ScoreBox homeInfo={homeTeamInfo} awayInfo={awayTeamInfo}/>
            <div className='mlb-mid-score'>
                <SideView/>
                <StadiumCloud/>
                <SideView/>
            </div>
        </div>
    )
}

function ScoreBox({homeInfo,awayInfo}){
    return(
        <div className='mlb-score-box'>
            <ScoreBug home={homeInfo} away={awayInfo}/>
            <BoxScore/>
        </div>
    )
}

function ScoreBug({home,away}){
    return(
        <div className='mlb-score-bug'>
            <div className='score-bug-section' style={{backgroundColor:`#${away.secondaryColor}`}}>
                <img className='score-bug-logo' src={away.primaryLogo}></img>
                <p style={{color:`#${away.primaryColor}`,paddingLeft:'10px'}}>{away.abbr}</p>
            </div>
            <div className='score-bug-section' style={{backgroundColor:`#${home.secondaryColor}`}}>
                <img className='score-bug-logo' src={home.primaryLogo}></img>
                <p style={{color:`#${home.primaryColor}`,paddingLeft:'10px'}}>{home.abbr}</p>
            </div>
        </div>
    )
}

function BoxScore(){
    const [numInnings,setNumInnings] = useState(9);
    const innings = Array.from({length:numInnings},(_,i)=> i+1);
    console.log(innings)
    return(
        <div className='mlb-box-score'>
            {innings.map((inn) => {
                return <Inning inningNumber={inn}/>
            })}
            <div style={{width:'10%',height:'100%',borderRight:'1px solid gray',borderLeft:'1px solid gray'}}></div>
            <Inning inningNumber={"R"}/>
            <Inning inningNumber={"H"}/>
            <Inning inningNumber={"E"}/>
        </div>
    )
}

function Inning({inningNumber}){
    const [awayScore,setAwayScore] = useState("");
    const [homeScore,setHomeScore] = useState("");
    return(
        <div className='mlb-score-inning'>
            <div style={{width:'100%',height:'5vh',borderBottom:'2px solid gray'}}><p>{awayScore}</p></div>
            <div style={{width:'100%',height:'5vh',borderBottom:'2px solid gray'}}><p>{homeScore}</p></div>
            <p>{inningNumber}</p>
        </div>
    )
}

function SideView(){
    return(
        <div className='mlb-side-view'>
            <p>Side</p>
        </div>
    )
}