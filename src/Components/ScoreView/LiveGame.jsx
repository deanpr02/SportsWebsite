import { useState,useEffect } from 'react'

import DevConsole from './DevConsole'
import GameBoxScore from './GameBoxScore'

import Blank from '../../assets/mlb-resources/blank_face.png'

import './LiveGame.css'

//assign each base a value for example 2 will be second base, and each additional hit will add to that value
//if the value exceeds 4, home. then the run scores and pop it from baserunners

export default function LiveGame({homeInfo,awayInfo,inningHalf,lineup,images,setLineup,setInning,setInningHalf,setHomeScore,setAwayScore,setHalfRuns}){
    const [strikes,setStrikes] = useState(0)
    const [balls,setBalls] = useState(0)
    const [outs,setOuts] = useState(0)

    const [bases,setBases] = useState([])
    const [lineupIndices,setLineupIndices] = useState({away:0,home:0})

    const [canAdvance,setCanAdvance] = useState(false)

    const battingLineup = inningHalf == 1 ? lineup['away']['batting'] : lineup['home']['batting']
    const pitchingLineup = inningHalf == 1 ? lineup['home']['pitching'] : lineup['away']['pitching']

    const addOut = () => {
        if(outs <= 2){
            setOuts((prev) => prev+1)
        }
    }

    useEffect(() => {
        if(outs < 3){
            if(strikes >= 3){
                setStrikes(0)
                setBalls(0)
                addOut()
            }
            if(balls >= 4){
                setBalls(0)
                setStrikes(0)

            }
        }
        else{
            setCanAdvance(true)
        }
    },[strikes,balls,outs])



    return(
        <>
            <div className='live-game-mid-score'>
                {battingLineup && pitchingLineup &&
                <>
                    <BattingSide 
                        teamInfo={inningHalf == 1 ? awayInfo : homeInfo} 
                        lineup={battingLineup} 
                        index={inningHalf == 1 ? lineupIndices['away'] : lineupIndices['home']}
                        images={images}/>
                    <GameMain strikes={strikes} balls={balls} outs={outs} bases={bases}/>
                    <PitchingSide 
                        teamInfo={inningHalf == 1 ? homeInfo : awayInfo}
                        lineup={pitchingLineup}
                        index={inningHalf == 1 ? lineupIndices['home'] : lineupIndices['away']}
                        images={images}/>
                </>
                }
            </div>
            <DevConsole 
                setStrikes={setStrikes} 
                setBalls={setBalls} 
                setOuts={setOuts}
                setInning={setInning}
                setInningHalf={setInningHalf} 
                setCanAdvance={setCanAdvance}
                setBases={setBases}
                setHomeScore={setHomeScore}
                setAwayScore={setAwayScore}
                setHalfRuns={setHalfRuns}
                setLineup={setLineup}
                setLineupIndices={setLineupIndices}
                lineup={lineup}
                lineupIndices={lineupIndices}
                bases={bases}
                inningHalf={inningHalf}
                strikes={strikes}
                balls={balls}
                outs={outs} 
                canAdvance={canAdvance}/>
            {lineup && <GameBoxScore awayInfo={awayInfo} homeInfo={homeInfo} lineup={lineup}/>}
        </>
    )
}

function PitchingSide({teamInfo,lineup,index,images}){
    
    return(
        <div className='live-game-side-view'>
            {lineup && 
            <>
                <PlayerPortrait color={teamInfo.primaryColor} logo={teamInfo.primaryLogo}/>
                <div>
                    <div style={{display:'flex',flexDirection:'row',margin:'10px'}}>
                        <p style={{marginRight:'1vw'}}>{lineup[0].name}</p><p>#{lineup[0].number}</p>
                    </div>
                    <p>{lineup[0].position}</p>
                </div>
                
            </>
            }
        </div>
    )
}

function BattingSide({teamInfo,lineup,index,images}){
    const hits = lineup[index]['hr'] ? 
        <p>{lineup[index]['hr']} HR</p>
        : lineup[index]['3b'] ?
        <p>{lineup[index]['3b']} 3B</p>
        : lineup[index]['2b'] ?
        <p>{lineup[index]['2b']} 2B</p>
        :
        <p></p>
    return(
        <div className='live-game-side-view'>
            {lineup && 
            <>
                <PlayerPortrait image={images[lineup[index].name]} color={teamInfo.primaryColor} logo={teamInfo.primaryLogo}/>
                <div>
                    <div style={{display:'flex',flexDirection:'row',margin:'10px'}}>
                        <p style={{marginRight:'1vw'}}>{lineup[index].name}</p><p>#{lineup[index].number}</p>
                    </div>
                    <p>{lineup[index].position}</p>
                </div>
                <p>{lineup[index]['h']} - {lineup[index]['ab']}</p>
                {hits}
            </>
            }
        </div>
    )
}

function PlayerPortrait({color,logo,image}){
    return(
        <div className='player-portrait-container' style={{border: `2px solid #${color}` ,backgroundColor:`#${color}60`}}>
            <div className='player-portrait-wrapper'><img className='player-portrait-img' src={image ? image : Blank}></img></div>
            <div className='player-portrait-team-logo'><img src={logo}></img></div>
        </div>
    )
}

function GameMain({strikes,balls,outs,bases}){
    return(
        <div className='live-game-main-view'>
            <StrikeZone/>
            <GameStatus strikes={strikes} balls={balls} outs={outs} bases={bases}/>
        </div>
    )
}

function GameStatus({strikes,balls,outs,bases}){
    const [occupiedBases,setOccupiedBases] = useState({1:false,2:false,3:false,4:false}) 
    
    const totalStrikes = 3
    const totalBalls = 4
    const totalOuts = 3
    
    const Circle = ({color}) => <div className='game-status-circle' style={{backgroundColor:color}}></div>
    
    useEffect(() => {
        const newBases = {1:false,2:false,3:false,4:false}
        bases.forEach((base) => {
            const baseVal = base.bases
            newBases[baseVal] = true
        })
        setOccupiedBases(newBases)
    },[bases])

    return(
        <div className='game-status-container'>
            <Bases occupiedBases={occupiedBases}/>
            <div className='game-status-strikes'>
                <p>Strikes</p>
                <div style={{display:'flex',flexDirection:'row'}}>
                    {Array.from({length:totalStrikes}).map((_,i) => {
                        return (
                            (i+1 <= strikes) ?
                            <Circle color={'red'}/>
                            :
                            <Circle color={'gray'}/>
                        )
                    })}
                </div>
                <p>Balls</p>
                <div style={{display:'flex',flexDirection:'row'}}>
                    {Array.from({length:totalBalls}).map((_,i) => {
                        return (
                            (i+1 <= balls) ?
                            <Circle color={'green'}/>
                            :
                            <Circle color={'gray'}/>
                        )
                    })}
                </div>
                <p>Outs</p>
                <div style={{display:'flex',flexDirection:'row'}}>
                    {Array.from({length:totalOuts}).map((_,i) => {
                        return (
                            (i+1 <= outs) ?
                            <Circle color={'yellow'}/>
                            :
                            <Circle color={'gray'}/>
                        )
                    })}
                </div>
            </div>
        </div>
    )
}

function Bases({occupiedBases}){

    return(
        <div className='game-status-bases'>
            <div className='first-base' style={{backgroundColor:occupiedBases[1] ? 'yellow' : 'white'}}></div>
            <div className='second-base' style={{backgroundColor:occupiedBases[2] ? 'yellow' : 'white'}}></div>
            <civ className='third-base' style={{backgroundColor:occupiedBases[3] ? 'yellow' : 'white'}}></civ>
            <div className='home-plate' style={{backgroundColor:occupiedBases[4] ? 'yellow' : 'white'}}></div>
        </div>
    )
}

function StrikeZone(){
    return(
        <div className='strike-zone-border'>
            <div className='strike-zone-main'></div>
        </div>
    )
}