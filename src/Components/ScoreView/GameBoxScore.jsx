import { useState } from 'react'

import './GameBoxScore.css'

export default function GameBoxScore({awayInfo,homeInfo,lineup}){
    const [team,setTeam] = useState('away')
    const lineupSelected = lineup[team]['batting']

    return(
        <div className='box-score-container'>
            <div className='box-score-selector'>
                <div className='box-score-switch'
                    style={{backgroundColor:team == 'away' ? `#${awayInfo.primaryColor}40`: `rgba(0,0,0,0)`,borderRadius:'10px 0 0 0'}}
                    onClick={()=>setTeam('away')}>
                        <p>{awayInfo.abbr}</p></div>
                <div className='box-score-switch'
                    style={{backgroundColor:team == 'home' ? `#${homeInfo.primaryColor}40`: `rgba(0,0,0,0)`,borderRadius:'0 10px 0 0',borderRight:'2px solid gray'}}
                    onClick={()=>setTeam('home')}>
                        <p>{homeInfo.abbr}</p></div>
            </div>
            <BoxScoreHeading color={team == 'away' ? awayInfo.primaryColor : homeInfo.primaryColor}/>
            <div style={{position:'relative'}}>
            <img className='box-score-background' src={team == 'away' ? awayInfo.primaryLogo : homeInfo.primaryLogo}></img>
            {lineupSelected.map((player) => {
                return <BoxScoreLine playerObj={player}/>
            })}
            </div>
        </div>
    )
}

function BoxScoreHeading({color}){
    return(
        <div className='box-score-heading-container' style={{backgroundColor:`#${color}40`}}>
            <div className='box-score-header-primary'><p>Name</p></div>
            <div className='box-score-header-secondary'><p>Pos</p></div>
            <div className='box-score-header-secondary'><p>#</p></div>
            <div className='box-score-header-secondary'><p>AB</p></div>
            <div className='box-score-header-secondary'><p>H</p></div>
            <div className='box-score-header-secondary'><p>RBI</p></div>
            <div className='box-score-header-secondary'><p>1B</p></div>
            <div className='box-score-header-secondary'><p>2B</p></div>
            <div className='box-score-header-secondary'><p>3B</p></div>
            <div className='box-score-header-secondary'><p>HR</p></div>
            <div className='box-score-header-secondary'><p>SO</p></div>
            <div className='box-score-header-secondary' style={{borderRight:'2px solid gray'}}><p>BB</p></div>
        </div>
    )
}

function BoxScoreLine({playerObj}){
    return(
        <div className='box-score-line-container'>
            <div className='box-score-primary'><p>{playerObj.name}</p></div>
            <div className='box-score-secondary'><p>{playerObj.position}</p></div>
            <div className='box-score-secondary'><p>{playerObj.number}</p></div>
            <div className='box-score-secondary'><p>{playerObj.ab}</p></div>
            <div className='box-score-secondary'><p>{playerObj.h}</p></div>
            <div className='box-score-secondary'><p>{playerObj.rbi}</p></div>
            <div className='box-score-secondary'><p>{playerObj['1b']}</p></div>
            <div className='box-score-secondary'><p>{playerObj['2b']}</p></div>
            <div className='box-score-secondary'><p>{playerObj['3b']}</p></div>
            <div className='box-score-secondary'><p>{playerObj.hr}</p></div>
            <div className='box-score-secondary'><p>{playerObj.so}</p></div>
            <div className='box-score-secondary' style={{borderRight:'2px solid gray'}}><p>{playerObj.bb}</p></div>
        </div>
    )
}