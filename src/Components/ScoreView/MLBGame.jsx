import { useState,useEffect,useMemo } from 'react'
import { useSearchParams } from 'react-router-dom'

import { useRetrieveTeam } from '../../Hooks/useRetrieveTeam'
import { useTeamRank } from  '../../Hooks/useFetchTeamRank'
import { useStatNames } from '../../Hooks/useStatNames'
import { useLineup } from '../../Hooks/useLineup'

import StadiumCloud from "./StadiumCloud"
import LiveGame from './LiveGame'
import GameSimulation from './GameSimulation'

import './MLBGame.css'

const gameState = {
    active: 0,
    inactive: 1,
    delayed: 2
};

export default function MLBGame(){
    const [homeScore,setHomeScore] = useState(0);
    const [awayScore,setAwayScore] = useState(0);
    const [inning,setInning] = useState(1);
    const [inningHalf,setInningHalf] = useState(1);
    const [halfRuns,setHalfRuns] = useState(0);

    const [searchParams] = useSearchParams();
    const homeName = searchParams.get('home');
    const awayName = searchParams.get('away');
    const { lineup,setLineup,images } = useLineup(searchParams.get('id'))

    
    const homeTeamInfo = useRetrieveTeam(homeName);
    const awayTeamInfo = useRetrieveTeam(awayName);

    return(
        <div className='mlb-game-container'>
            {lineup &&
            <>
            <ScoreGraphic home={homeTeamInfo} away={awayTeamInfo} homeScore={homeScore} awayScore={awayScore} inning={inning} inningHalf={inningHalf}/>
            <ScoreBoard homeInfo={homeTeamInfo} awayInfo={awayTeamInfo} inning={inning} inningHalf={inningHalf} halfRuns={halfRuns}/>
            {false ? 
            <div className='mlb-mid-score'>
                <>
                    <SideView city={awayTeamInfo.city} color={awayTeamInfo.primaryColor} teamName={awayTeamInfo.abbr}/>
                    <StadiumCloud/>
                    <SideView city={homeTeamInfo.city} color={homeTeamInfo.primaryColor} teamName={homeTeamInfo.abbr}/>
                </>
            </div>
            :
            <LiveGame 
                homeInfo={homeTeamInfo} 
                awayInfo={awayTeamInfo} 
                inningHalf={inningHalf} 
                lineup={lineup}
                images={images}
                setLineup={setLineup}
                setInning={setInning} 
                setInningHalf={setInningHalf}
                setHomeScore={setHomeScore}
                setAwayScore={setAwayScore}
                setHalfRuns={setHalfRuns}/>
            }
            </>
        }
        </div>
    )
}

function ScoreGraphic({home,away,homeScore,awayScore,inning,inningHalf}){
    return(
        <div style={{display:'flex',flexDirection:'column', alignItems:'center'}}>
            <div className='mlb-score-graphic'>
                <div style={{paddingRight:'20px'}}><img src={away.primaryLogo} style={{width:'10vh',height:'10vh',objectFit:'contain',backgroundColor:`#${away.secondaryColor}`,borderRadius:'10px',padding:'5px'}}></img></div>
                <p style={{paddingRight:'30px'}}>{awayScore}</p>
                <p style={{paddingRight:'20px'}}>{homeScore}</p>
                <div><img src={home.primaryLogo} style={{width:'10vh',height:'10vh',objectFit:'contain',backgroundColor:`#${home.secondaryColor}`,borderRadius:'10px',padding:'5px'}}></img></div>
            </div>
            {false ? 
                <p style={{fontFamily: 'Bebas Neue, sans-serif',fontSize:'20px'}}>1:00 P.M.</p>
                :
                <div style={{display:'flex',flexDirection:'row',fontFamily: 'Bebas Neue, sans-serif',fontSize:'20px'}}>
                    {inningHalf > 0 ? <p>Top</p> : <p>Bottom</p>} 
                    <p style={{marginLeft:'10px'}}>{inning}</p>
                </div>
            }
        </div>
    )
}

function ScoreBoard({homeInfo,awayInfo,inning,inningHalf,halfRuns}){
    const [numInnings,setNumInnings] = useState(9);
    const [gameScore,setGameScore] = useState(undefined)

    useEffect(() => {
        if(!gameScore){
            const newGameScore = {}
            const i = Array.from({length:numInnings},(_,i) => i+1)
            i.forEach((inning) => {
                newGameScore[inning] = {top:undefined,bot:undefined}
            })
            newGameScore[1] = {top:0,bot:undefined}
            setGameScore(newGameScore)
        }

    },[])

    useEffect(() => {
        if(gameScore){
            const newGameScore = {...gameScore}
            const half = inningHalf == 1 ? 'top' : 'bot'
            if(newGameScore[inning][half] == undefined){
                newGameScore[inning][half] = 0
            }
            else{
                newGameScore[inning][half] = halfRuns
            }
            setGameScore(newGameScore)
        }
    },[inningHalf,halfRuns])


    return(
        <div className='mlb-score-box'>
            <ScoreBug home={homeInfo} away={awayInfo}/>
            {gameScore && 
                <ScoreBox gameScore={gameScore} numInnings={numInnings}/>
            }
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

function ScoreBox({gameScore,numInnings}){
    const innings = Array.from({length:numInnings},(_,i)=> i+1);
    
    return(
        <div className='mlb-box-score'>
            {innings.map((inn) => {
                return <Inning inningNumber={inn} score={gameScore[inn]}/>
            })}
            <div style={{width:'10%',height:'100%',borderLeft:'1px solid gray'}}></div>
            <Inning inningNumber={"R"}/>
            <Inning inningNumber={"H"}/>
            <Inning inningNumber={"E"}/>
        </div>
    )
}

function Inning({inningNumber,score}){
    const awayScore = score ? score.top : ''
    const homeScore = score ? score.bot : ''
    
    const color = inningNumber % 2 == 0 ? '#111111' : '#333333'
    return(
        <div className='mlb-score-inning' style={{backgroundColor:color}}>
            <div className='mlb-score-inning-section'><p>{awayScore}</p></div>
            <div className='mlb-score-inning-section'><p>{homeScore}</p></div>
            <p>{inningNumber}</p>
        </div>
    )
}

function SideView({city,color,teamName}){
    const stats = useMemo(() => ['p_earned_run_avg','b_hr','b_r'], []);
    const formattedStats = useStatNames()
    const {rankings} = useTeamRank(teamName,stats)

    return(
        <div className='mlb-side-view'>
            <p>{city}</p>
            {rankings && formattedStats && Object.entries(rankings).map(([statName,obj]) => {
                return <TeamStatBar statName={formattedStats[statName]} statRank={obj.rank} stat={obj.value} color={color}/>
            })}
        </div>
    )
}

function TeamStatBar({statName,statRank,stat,color}){
    const barFilled = ((30 - parseInt(statRank)) / 29) * 90 + 10;
    
    return(
        <>
        <div className='mlb-score-statname'><p>{statName}</p></div>
        <div className='mlb-score-stat'>
                <p style={{width:'8vh'}}>{stat}</p>
                <div className='score-stat-bar-wrapper'>
                    <div className='score-stat-bar' style={{backgroundColor:`#${color}`, width:`${barFilled}%`}}>
                        <p style={{fontSize:'14px',marginRight:'10px'}}>{statRank}</p>
                    </div>
                </div>
            </div>
        </>
    )
}