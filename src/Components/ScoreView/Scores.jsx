import { useState } from 'react'
import { Routes,Route,useNavigate } from 'react-router-dom'

import { useGetSchedule } from "../../Hooks/useGetSchedule"
import { useRetrieveTeam } from '../../Hooks/useRetrieveTeam';

import MLBGame from './MLBGame';

import './Scores.css'

export default function Scores(){
    const {schedule} = useGetSchedule('MLB');
    const [currentDay,setCurrentDay] = useState(0);
    
    return(
        <div>
            <div className='scores-date-list'>
                {schedule.map((item,index) => {
                    return currentDay === index ?
                        <DateListing index={index} date={item.date} setCurrentDay={setCurrentDay} isSelected={true}></DateListing>
                        :
                        <DateListing index={index} date={item.date} setCurrentDay={setCurrentDay} isSelected={false}></DateListing>
                })}
            </div>
            {schedule.length > 0 && <GameList games={schedule[currentDay].games}/>}
        </div>
    )
}


function DateListing({index,date,isSelected,setCurrentDay}){
    const formattedDate = date.slice(5,date.length).replace('-','/')
    return(
        <>
        {isSelected ?
            <div className='date-list-item' style={{backgroundColor:'rgba(200,200,200,0.3)'}}>
                <p>{formattedDate}</p>
            </div>
            :
            <div className='date-list-item' onClick={()=>setCurrentDay(index)}>
                <p>{formattedDate}</p>
            </div>
        }
        </>
    )
}

function GameList({games}){
    const [homeTeam,setHomeTeam] = useState("New York Yankees");
    const [awayTeam,setAwayTeam] = useState("Boston Red Sox");

    return(
        <>
        <Routes>
            {console.log(games)}
            <Route path="game" element={<MLBGame home={homeTeam} away={awayTeam}/>}/>
            <Route path="/" element={<><div className='score-game-list'>
                    {games.map(((game,i) => {
                        return <Game  key={i} home={game.teams.home} away={game.teams.away} venue={game.venue.name}/>
                    }))}
                </div></>}/>
        </Routes>
        </>
    )
}

function Game({away,home,venue}){
    const homeInfo = useRetrieveTeam(home.team.name)
    const awayInfo = useRetrieveTeam(away.team.name)
    const navigate = useNavigate();

    return(
        <>
                    <div className='score-game-detail-container'>
                        <div className='score-game-container' onClick={()=>navigate("game")}>
                            <Team teamInfo={awayInfo} dir={-1} flexOrientation={'row'}/>
                            <p style={{fontSize:'24px'}}>VS.</p>
                            <Team teamInfo={homeInfo} dir={1} flexOrientation={'row-reverse'}/>
                        </div>
                        <GameInfo homeInfo={homeInfo} awayInfo={awayInfo} venue={venue}/>
                    </div>
        </>
    )
}

function GameInfo({homeInfo,awayInfo,venue}){
    return(
        <div className='game-info-container'>
            <p>00:00 PM.</p>
            <p>{venue}</p>
            <GamePredictionPanel awayInfo={awayInfo} homeInfo={homeInfo}/>
        </div>
    )
}

function GamePredictionPanel({awayInfo,homeInfo}){
    const [gamePicked,setGamePicked] = useState(undefined)

    return(
        <>
        {!gamePicked ? 
            <div className='game-prediction-container'>
                    <p style={{color:'black'}}>Who Ya Got?</p>
                    <div style={{display:'flex',flexDirection:'row'}}>
                        <div className='prediction-selector' style={{borderRight:'2px solid white',borderRadius:'10px 0 0 10px',backgroundColor:`#${awayInfo.primaryColor}`}}
                            onClick={()=>setGamePicked(awayInfo)}>
                            {awayInfo.abbr}
                        </div>
                        <div className='prediction-selector' style={{borderRadius:'0 10px 10px 0',backgroundColor:`#${homeInfo.primaryColor}`}}
                            onClick={()=>setGamePicked(homeInfo)}>
                            {homeInfo.abbr}
                        </div>
                    </div>
            </div>
            :
            <div className='game-prediction-container'>
                <p style={{color:'black'}}>Voted {gamePicked.abbr}</p>
                <div className='prediction-selected' style={{width:'100%',backgroundColor:`#${gamePicked.primaryColor}`,borderRadius:'10px'}}></div>
            </div>
        }
        </>
    )
}

function Team({teamInfo,flexOrientation}){

    return(
        <div>
        {teamInfo &&
        <div className='score-team-container' style={{flexDirection:flexOrientation,border:`2px solid #${teamInfo.primaryColor}`}}>
            <div className='corner-borders' style={{'--psuedo-border-color':`#${teamInfo.primaryColor}`}}><span><img className='score-logo' src={teamInfo.primaryLogo} style={{backgroundImage:`linear-gradient(color-mix(in srgb,#${teamInfo.primaryColor} 60%,#${teamInfo.secondaryColor}),#${teamInfo.secondaryColor}`,flexDirection:flexOrientation}}></img></span></div>
            <div style={{display:'flex',flexDirection:'column',justifyContent:'center',fontSize:'32px',paddingLeft:'10px',paddingRight:'10px'}}><p>{teamInfo.city}</p><p>{teamInfo.name}</p></div>
        </div>
        }
        </div>
    )
}