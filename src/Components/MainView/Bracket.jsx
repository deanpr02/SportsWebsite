import './Bracket.css'
import { useRetrieveTeam } from '../../Hooks/useRetrieveTeam'
import { useDatabase } from '../../Hooks/useDatabase'
import { useState,useEffect,useContext } from 'react'

import DropDown from '../Utility/DropDown'
import Loading from './Loading'

import AL from '../../assets/mlb-resources/american-league.png'
import NL from '../../assets/mlb-resources/national-league.png'
import Trophy from '../../assets/mlb-resources/ws-trophy.png'

/* Save the webscraped information to the session so we dont have to keep making the calls to the api
each time a user redirects to a different page and then returns*/
export default function Bracket(){

    const [data,setData] = useState({})
    const years = Array.from({ length: 2024 - 2000 + 1 }, (_, i) => 2000 + i);
    const [year,setYear] = useState('2024')
    const { dataObj,isLoading } = useDatabase('/api/bracket',{'year':year})

    return(
        <>
        <div className="bracket-container">
            {console.log(dataObj)}
            <div className='bracket-drop'><DropDown data={years} state={year} setFunc={setYear}/></div>
            {dataObj && (
                isLoading ? 
                    <Loading color={'FFFFFF'}/>
                    :
                    <div className="bracket">
                    <LeftBracket results={dataObj["AL"]}/>
                    <Championship leftConference={dataObj['WS']['AL']} rightConference={dataObj['WS']['NL']}/>
                    <RightBracket results={dataObj["NL"]}/>
                    </div>
            )
            }
        </div>
        </>
    )
}

function LeftBracket({results}){

    return(
        <div className="row-container" >
            <img className='bracket-background-img' src={AL}></img>
                    {Object.entries(results).map(([roundName, roundData],i) => (
                        Array.isArray(roundData) && <div key={roundName}>
                            <Round roundData={roundData} offset={(Object.keys(results).length-i-1)*15} dir={1}/>
                        </div>
                    ))}
        </div>
    )
}

function RightBracket({results}){

    return(
        <div className="row-container">
            <img className='bracket-background-img' src={NL}></img>
                    {Object.entries(results).reverse().map(([roundName, roundData],i) => (
                        Array.isArray(roundData) && <div key={roundName}>
                            <Round roundData={roundData} offset={(i)*15} dir={-1}/>
                        </div>
                    ))}
        </div>
    )
}

function Championship({leftConference,rightConference}){
    const leftTeam = useRetrieveTeam(leftConference?.name)
    const rightTeam = useRetrieveTeam(rightConference?.name)
    const [rendered,setRendered] = useState(false)

    useEffect(() =>{
        if(Object.keys(leftConference).length != 0 && Object.keys(rightConference).length != 0){
            setRendered(true)
        }
    },[leftConference,rightConference])

    return(
        <div style={{display:'flex',flexDirection:'column',fontSize:'30px',height:'50vh',justifyContent:'center',alignItems:'center',alignSelf:'center'}}>
            <img className='championship-background-img' src={Trophy}></img>
        {rendered && 
        <div className="bracket-championship-container">
            <div className="championship-series">
                <div className="left-conference-champion">
                    <Team team={leftTeam} seriesScore={leftConference.wins} opacity={leftConference.wins > rightConference.wins ? 1 : 0.75}/>
                </div>
                <div className="right-conference-champion">
                    <Team team={rightTeam} seriesScore={rightConference.wins} opacity={rightConference.wins > leftConference.wins ? 1 : 0.75}/>
                </div>
            </div>
            </div>
        }
        </div>
        /*
        <div className="championship-container">
        <p>Left Conference Winner</p>
        <p>{leftConference.name}</p>
        <p>Games won: {leftConference.games_won}</p>
        </div>
        */
    )
}

function Round({roundData,offset,dir}){
    const rotationDeg = offset === 0 ? 0 : 45

    if (roundData === undefined) {
        return <div>Round data is undefined</div>;
    }
    return(
    <div className="round-container">
        {roundData.map((match, index) => {
            return (
                <div className="match-div" key={index}style={{height:`${offset}vh`}}>
                    {dir == 1 ? 
                    <>
                    <MatchUp homeName={match.home.name} awayName={match.away.name} homeWon={match.home.wins} awayWon={match.away.wins}/>
                    {index < roundData.length / 2 ? 
                        <div className='bracket-line' style={{transform:`rotate(${rotationDeg}deg)`}}></div>
                        :
                        <div className='bracket-line' style={{transform:`rotate(${rotationDeg*-1}deg)`}}></div>
                    }
                    </>
                    :
                    <>
                    {index < roundData.length / 2 ? 
                        <div className='bracket-line' style={{transform:`rotate(${rotationDeg*-1}deg)`}}></div>
                        :
                        <div className='bracket-line' style={{transform:`rotate(${rotationDeg}deg)`}}></div>
                    }
                    <MatchUp homeName={match.home.name} awayName={match.away.name} homeWon={match.home.wins} awayWon={match.away.wins}/>
                    </>
                    }
                </div>
            );
        })}
    </div>
    )
    
}

function MatchUp({homeName,awayName,homeWon,awayWon}){
    const homeInfo = useRetrieveTeam(homeName);
    const awayInfo = useRetrieveTeam(awayName);

    return(
        <div className="match-up">
            {homeInfo && awayInfo &&
                <>
                    <Team team={awayInfo} seriesScore={awayWon} opacity={awayWon > homeWon ? 1 : 0.75}/>
                    <Team team={homeInfo} seriesScore={homeWon} opacity={homeWon > awayWon ? 1 : 0.75}/>
                </>
            }
        </div>
    )
}

function Team({team,seriesScore,opacity}){
    return(
        <div className="team" style={{opacity:opacity}}>
            <img className="team-logo" src={team.secondaryLogo} alt="Team Logo" style={{"backgroundColor":`white`,border:'2px solid black'}}></img>
            <div className="team-name">
                <div className="team-city">
                <p>{team.city}</p>
                </div>
                <p>{team.name}</p>
            </div>
            <div className='score'><p style={{height:'100%'}}>{seriesScore}</p></div>
        </div>
    )
}
