import { useState,useEffect } from 'react'
import { Routes,Route,useNavigate } from 'react-router-dom'

import { useGetSchedule } from "../../Hooks/useGetSchedule"
import { useRetrieveTeam } from '../../Hooks/useRetrieveTeam';
//import { useDatabase } from '../../Hooks/useDatabase';

import MLBGame from './MLBGame';

import Stadium from '../../assets/stadium.png'
import Line from '../../assets/line.png'

import './Scores.css'

export default function Scores(){
    const {schedule} = useGetSchedule('MLB');
    const [homeTeam,setHomeTeam] = useState("New York Yankees");
    const [awayTeam,setAwayTeam] = useState("Boston Red Sox");
    //const {dataObj,isLoading} = useDatabase('/api/test',{})

    const [currentDay,setCurrentDay] = useState(-1);

    useEffect(() => {
        if(schedule.length > 0){
            const today = new Date();
            const year = today.getFullYear();
            const month = String(today.getMonth() + 1).padStart(2, '0');
            const day = String(today.getDate()).padStart(2, '0');
            const formattedDate = `${year}-${month}-${day}`;
            const newIndex = schedule.findIndex(obj => obj.date === formattedDate);
            setCurrentDay(newIndex !== -1 ? newIndex : 0);
        }
    }, [schedule]);

    useEffect(() => {

    },[])
    
    return(
        <Routes>
            <Route path='game' element={<MLBGame home={homeTeam} away={awayTeam}/>}/>
            <Route path='/' element={
                <>
                    <div>
                        <div className='scores-date-list'>
                            {schedule.map((item,index) => {
                                return currentDay === index ?
                                    <DateListing index={index} date={item.date} setCurrentDay={setCurrentDay} isSelected={true}/>
                                    :
                                    <DateListing index={index} date={item.date} setCurrentDay={setCurrentDay} isSelected={false}/>
                            })}
                        </div>
                        {schedule.length > 0 && currentDay > -1 && <GameList games={schedule[currentDay].games} />}
                    </div>
                </>
            }/>
        </Routes>
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

    return(
        <div className='score-game-list'>
            {games.map(((game,i) => {
                return <Game  
                        key={i} 
                        gameID={game.gamePk}
                        home={game.teams.home} 
                        away={game.teams.away} 
                        venue={game.venue.name}
                        date={game.gameDate}
                        status={game.status.codedGameState}/>
            }))}
    </div>
    )
}

function Game({gameID,away,home,venue,date,status}){
    const homeInfo = useRetrieveTeam(home.team.name)
    const awayInfo = useRetrieveTeam(away.team.name)
    const navigate = useNavigate();

    const formattedDate = new Date(date);

    // Get the time in 12-hour format with AM/PM, in the local time zone:
    const options = { hour: 'numeric', minute: '2-digit', hour12: true };
    const formattedTime = formattedDate.toLocaleTimeString(undefined, options);

    const gameStatus = status === 'F' ? true : false;

    const handleClick = () => {
        navigate({
            pathname: "game",
            search: `?id=${encodeURIComponent(gameID)}&home=${encodeURIComponent(home.team.name)}&away=${encodeURIComponent(away.team.name)}`
        })
    }

    return(
        <>  
            {!gameStatus ?
                <div className='score-game-detail-container'>
                    <div className='score-game-container' onClick={handleClick}>
                        <Team teamInfo={awayInfo} flexOrientation={'row'}/>
                        <p style={{fontSize:'24px'}}>VS.</p>
                        <Team teamInfo={homeInfo} flexOrientation={'row-reverse'}/>
                    </div>
                    <GameInfo homeInfo={homeInfo} awayInfo={awayInfo} venue={venue} time={formattedTime} gameStatus={gameStatus}/>
                </div>
                :
                <div className='score-game-detail-container'>
                    <div className='score-game-container' onClick={handleClick}>
                        <TeamScore teamInfo={awayInfo} score={away.score} record={away.leagueRecord} isWinner={away.isWinner}/>
                        <TeamScore teamInfo={homeInfo} score={home.score} record={home.leagueRecord} isWinner={home.isWinner}/>
                    </div>
                    <GameInfo homeInfo={homeInfo} awayInfo={awayInfo} venue={venue} time={'Final'} gameStatus={gameStatus}/>
                </div>
            }  
        </>
    )
}

function GameInfo({homeInfo,awayInfo,venue,time,gameStatus}){
    return(
        <div className='game-info-container'>
            <div style={{marginTop:'10px'}}>
            <p style={{fontSize:'4vh'}}>{time}</p>
                <div className='game-info-detail-section'>
                    <img src={Stadium}></img>
                    <p>{venue}</p>
                </div>
                <div className='game-info-detail-section'>
                    <img src={Line}></img>
                    <p>{homeInfo.abbr} -500</p>
                </div>
            </div>
            {!gameStatus &&
                <GamePredictionPanel awayInfo={awayInfo} homeInfo={homeInfo}/>
            }
        </div>
    )
}

function GamePredictionPanel({awayInfo,homeInfo}){
    const [gamePicked,setGamePicked] = useState(undefined)

    return(
        <>
        {!gamePicked ? 
            <div className='game-prediction-container'>
                    <p style={{color:'black'}}>Predict</p>
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

function TeamScore({teamInfo,score,record,isWinner}){
    const opacity = isWinner ? 1 : 0.5;

    return(
        <div>
        {teamInfo &&
            <>
                <div className='score-team-container' style={{marginBottom:'5px',marginTop:'5px',border:`2px solid #${teamInfo.primaryColor}`}}>
                    <div className='corner-borders' style={{'--psuedo-border-color':`#${teamInfo.primaryColor}`}}><span><img className='score-logo' src={teamInfo.primaryLogo} style={{backgroundImage:`linear-gradient(color-mix(in srgb,#${teamInfo.primaryColor} 60%,#${teamInfo.secondaryColor}),#${teamInfo.secondaryColor}`}}></img></span></div>
                    <div  className="score-team-wrapper">
                    <div className='score-team-preview' style={{opacity:opacity}}><p>{teamInfo.abbr}</p><p className='team-score-label'>{score}</p></div>
                    <div className='score-team-record'>
                        <p>{record.wins}-{record.losses}</p>
                    </div>
                    </div>
                </div>
            </>
        }
        </div>
    )
}