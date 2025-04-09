import { useState } from 'react'
import { Routes,Route,useNavigate } from 'react-router-dom'
import { useGetSchedule } from "../../Hooks/useGetSchedule"
import './Scores.css'
import { useRetrieveTeam } from '../../Hooks/useRetrieveTeam';
import MLBGame from './MLBGame';

export default function Scores(){
    const {schedule} = useGetSchedule('MLB');
    const [currentDay,setCurrentDay] = useState(0);
    
    return(
        <div>
            <div className='scores-date-list'>
                {console.log(schedule)}
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
            <Route path="game" element={<MLBGame home={homeTeam} away={awayTeam}/>}/>
            <Route path="/" element={<><div className='score-game-list'>
                    {games.map((game => {
                        return <Game home={game.teams.home} away={game.teams.away} venue={game.venue.name}/>
                    }))}
                </div></>}/>
        </Routes>
        </>
    )
}

function Game({away,home,venue}){
    const homeTeam = home.team.name
    const awayTeam = away.team.name
    const navigate = useNavigate();

    return(
        <>
                    <div className='score-game-detail-container' onClick={()=>navigate("game")}>
                        <div className='score-game-container'>
                            <Team name={awayTeam} dir={-1} flexOrientation={'row'}/>
                            <p style={{fontSize:'24px'}}>VS.</p>
                            <Team name={homeTeam} dir={1} flexOrientation={'row-reverse'}/>
                        </div>
                        <GameInfo venue={venue}/>
                    </div>
        </>
    )
}

function GameInfo({venue}){
    return(
        <div className='game-info-container'>
        <p>00:00 PM.</p>
        <p>{venue}</p>
        </div>
    )
}

function Team({name,flexOrientation}){
    //dumb fix cause API is broken
    const teamName = name === 'Athletics' ? 'Oakland Athletics' : name;
    const teamInfo = useRetrieveTeam(teamName);

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