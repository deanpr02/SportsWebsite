import './Bracket.css'
import { useRetrieveTeam } from '../../Hooks/useRetrieveTeam'
import { useDatabase } from '../../Hooks/useDatabase'
import { useState,useEffect,useContext } from 'react'

import AL from '../../assets/mlb-resources/american-league.png'
import NL from '../../assets/mlb-resources/national-league.png'
import Trophy from '../../assets/mlb-resources/ws-trophy.png'

/* Save the webscraped information to the session so we dont have to keep making the calls to the api
each time a user redirects to a different page and then returns*/
export default function Bracket(){

    const [data,setData] = useState({})
    const [year,setYear] = useState('2024')
    const { dataObj,isLoading } = useDatabase('/api/bracket',{'year':year})


    //Make custom hooks for these use effects
    useEffect(() =>{
        const fetchData = async () => {
            try{
                const response = await fetch('http://localhost:5000/api/webscrape/postseason');
                if(!response.ok){
                    throw new Error(`HTTP error! status: ${response.status}`)
                }
                const result = await response.json();
                setData(result);
            }
            catch (error) {
            if (error instanceof TypeError) {
                console.log('Network or CORS error: ' + error.message);
            } else {
                console.log('Fetch error: ' + error.message);
            }
        } 
        }
        fetchData();
    },[])

    return(
        <>
        <div className="bracket-container">
            <YearSelector data={data} year={year} setYear={setYear}/>
            {dataObj && 
                <div className="bracket">
                <LeftBracket results={dataObj["AL"]}/>
                <Championship leftConference={dataObj['WS']['AL']} rightConference={dataObj['WS']['NL']}/>
                <RightBracket results={dataObj["NL"]}/>
                </div>
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
            const winningTeam = useRetrieveTeam(match.home.name);
            const losingTeam = useRetrieveTeam(match.away.name);
            return (
                <div className="match-div" key={index}style={{height:`${offset}vh`}}>
                    {dir == 1 ? 
                    <>
                    <MatchUp home={winningTeam} away={losingTeam} homeWon={match.home.wins} awayWon={match.away.wins}/>
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
                    <MatchUp home={winningTeam} away={losingTeam} homeWon={match.home.wins} awayWon={match.away.wins}/>
                    </>
                    }
                </div>
            );
        })}
    </div>
    )
    
}

function MatchUp({home,away,homeWon,awayWon}){
    return(
        <div className="match-up">
            <Team team={away} seriesScore={awayWon} opacity={awayWon > homeWon ? 1 : 0.75}/>
            <Team team={home} seriesScore={homeWon} opacity={homeWon > awayWon ? 1 : 0.75}/>
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

function YearSelector({data,year,setYear}){
    const [isVisible,setIsVisible] = useState(false)
    return (
        <div className="drop-down">
        <DropDownTop displayedText={year} setIsVisible={setIsVisible}/>
        {isVisible && <DropDown data={data} setYear={setYear} setIsVisible={setIsVisible}/>}
        </div>
    );
}


function DropDownTop({displayedText,setIsVisible}){
    return(
        <div className="dropdown-top" onClick={()=>setIsVisible(true)}>
            <p>{displayedText}</p>
        </div>
    )
}


function DropDown({data,setYear,setIsVisible}){
    return(
        <div className="dropdown-container" onMouseLeave={()=>setIsVisible(false)}>
            {Object.keys(data).reverse().map((key =>
                <DropDownItem key={key} content={key} setYear={setYear} setIsVisible={setIsVisible}/>
            ))}
        </div>
    )
}

function DropDownItem({content,setYear,setIsVisible}){
    const handleClick = () => {
        setYear(content);
        setIsVisible(false);
    }
    
    return(
        <div className="dropdown-item">
            <p onClick={handleClick}>{content}</p>
        </div>
    )
}