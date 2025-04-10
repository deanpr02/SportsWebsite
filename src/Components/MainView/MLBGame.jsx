import { useState } from 'react'
import { useRetrieveTeam } from '../../Hooks/useRetrieveTeam'
import './MLBGame.css'
import StadiumCloud from "./StadiumCloud"

const gameState = {
    active: 0,
    inactive: 1,
    delayed: 2
};

export default function MLBGame({home,away}){
    const [homeScore,setHomeScore] = useState(0);
    const [awayScore,setAwayScore] = useState(0);
    const homeTeamInfo = useRetrieveTeam(home);
    const awayTeamInfo = useRetrieveTeam(away);

    return(
        <div className='mlb-game-container'>
            <ScoreGraphic home={homeTeamInfo} away={awayTeamInfo} homeScore={homeScore} awayScore={awayScore}/>
            <ScoreBox homeInfo={homeTeamInfo} awayInfo={awayTeamInfo}/>
            <div className='mlb-mid-score'>
                <SideView city={awayTeamInfo.city} color={awayTeamInfo.primaryColor}/>
                <StadiumCloud/>
                <SideView city={homeTeamInfo.city} color={homeTeamInfo.primaryColor}/>
            </div>
        </div>
    )
}

function ScoreGraphic({home,away,homeScore,awayScore}){
    return(
        <div style={{display:'flex',flexDirection:'column', alignItems:'center'}}>
            <div className='mlb-score-graphic'>
                <div style={{objectFit:'contain',paddingRight:'20px'}}><img src={away.primaryLogo} style={{width:'10vh',height:'10vh',backgroundColor:`#${away.secondaryColor}`,borderRadius:'10px',padding:'5px'}}></img></div>
                <p style={{paddingRight:'30px'}}>{awayScore}</p>
                <p style={{paddingRight:'20px'}}>{homeScore}</p>
                <div style={{objectFit:'contain'}}><img src={home.primaryLogo} style={{width:'10vh',height:'10vh',backgroundColor:`#${home.secondaryColor}`,borderRadius:'10px',padding:'5px'}}></img></div>
            </div>
            <p style={{fontFamily: 'Bebas Neue, sans-serif',fontSize:'20px'}}>1:00 P.M.</p>
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
            <div className='score-bug-section' style={{backgroundColor:`#333333`}}>
                <img className='score-bug-logo' src={away.primaryLogo}></img>
                <p style={{color:'white',paddingLeft:'10px'}}>{away.abbr}</p>
            </div>
            <div className='score-bug-section' style={{backgroundColor:`#333333`}}>
                <img className='score-bug-logo' src={home.primaryLogo}></img>
                <p style={{color:'white',paddingLeft:'10px'}}>{home.abbr}</p>
            </div>
        </div>
    )
}

function BoxScore(){
    const [numInnings,setNumInnings] = useState(9);
    const innings = Array.from({length:numInnings},(_,i)=> i+1);
    
    return(
        <div className='mlb-box-score'>
            {innings.map((inn) => {
                return <Inning inningNumber={inn}/>
            })}
            <div style={{width:'10%',height:'100%',borderLeft:'1px solid gray'}}></div>
            <Inning inningNumber={"R"}/>
            <Inning inningNumber={"H"}/>
            <Inning inningNumber={"E"}/>
        </div>
    )
}

function Inning({inningNumber}){
    const [awayScore,setAwayScore] = useState("");
    const [homeScore,setHomeScore] = useState("");
    const color = inningNumber % 2 == 0 ? '#111111' : '#333333'
    return(
        <div className='mlb-score-inning' style={{backgroundColor:color}}>
            <div style={{width:'100%',height:'5vh',borderBottom:'1px solid gray'}}><p>{awayScore}</p></div>
            <div style={{width:'100%',height:'5vh',borderBottom:'1px solid gray'}}><p>{homeScore}</p></div>
            <p>{inningNumber}</p>
        </div>
    )
}

function SideView({city,color}){
    return(
        <div className='mlb-side-view'>
            <p>{city}</p>
            <div className='mlb-score-stat'>
                <div style={{marginRight:'10px',marginLeft:'10px'}}><p>Runs</p></div>
                <div className='score-stat-bar-wrapper'>
                    <div className='score-stat-bar' style={{backgroundColor:`#${color}`}}>
                        <p style={{fontSize:'14px',marginRight:'10px'}}>1000</p>
                    </div>
                </div>
            </div>
        </div>
    )
}