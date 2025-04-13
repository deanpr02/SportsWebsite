import { useState,useEffect } from 'react'
import './StandingsChart.css'
import { useRetrieveTeam } from '../../Hooks/useRetrieveTeam'

import AL from '../../assets/mlb-resources/american-league.png'
import NL from '../../assets/mlb-resources/national-league.png'

export default function StandingsChart({standings,setSingleDiv,setConference,setDivision}){
    return(
        <div className='standings-chart-container'>
            <div className='standings-conference'>
                <div style={{display:'flex',width:'100%',height:'2vh',margin:'5px',justifyContent:'center',alignItems:'center'}}>
                    <p style={{marginRight:'5px'}}>American League</p>
                    <img src={AL} style={{width:'2vh'}}></img>
                </div>
                {Object.entries(standings['American League']).map(([name,teams]) => {
                    return <StandingsDivision conference={'American League'} divisionName={name} divisionTeams={teams} setConference={setConference} setDivision={setDivision} setSingleDiv={setSingleDiv}/>
                })}
            </div>
            <div className='standings-conference'>
                <div style={{display:'flex',width:'100%',height:'2vh',margin:'5px',justifyContent:'center',alignItems:'center'}}>
                    <p style={{marginRight:'5px'}}>National League</p>
                    <img src={NL} style={{width:'2vh'}}></img>
                </div>
                {Object.entries(standings['National League']).map(([name,teams]) => {
                    return <StandingsDivision conference={'National League'} divisionName={name} divisionTeams={teams} setConference={setConference} setDivision={setDivision} setSingleDiv={setSingleDiv}/>
                })}
            </div>      
        </div>
    )
}

function StandingsDivision({conference,divisionName,divisionTeams,setConference,setDivision,setSingleDiv}){
    const [sortedTeams,setSortedTeams] = useState(undefined)
    
    useEffect(() => {
        const sortFunc = (a,b) => {
            return b[1]['W'] - a[1]['W']
        }

        const sortTeams = () => {
            const newTeams = Object.entries(divisionTeams).sort(sortFunc)
            setSortedTeams(newTeams)
        }

        sortTeams()
    },[divisionTeams])

    const handleClick = () => {
        setConference(conference)
        setDivision(divisionName)
        setSingleDiv(true)
    }

    return(
        <div className='standings-division-container' onClick={handleClick}>
            <p style={{fontSize:'18px',width:'100%',borderBottom:'1px solid gray'}}>{divisionName}</p>
            {sortedTeams && sortedTeams.map(([teamName,obj]) => {
                return <StandingsRow teamName={teamName} teamRecord={obj}/>
            })}
        </div>
    )
}

function StandingsTitles(){
    return(
        <div>
            <div style={{borderRight:'2px solid gray',padding:'5px',marginRight:'5px'}}><p style={{width:'3vh'}}></p></div>
        </div>
    )
}

function StandingsRow({teamName,teamRecord}){
    const teamInfo = useRetrieveTeam(teamName)
    const totalGames = teamRecord.W + teamRecord.L > 0 ? teamRecord.W + teamRecord.L : 1
    const winPerc = (teamRecord.W / totalGames).toFixed(3)

    return(
        <div className='standings-team-row'>
            {teamInfo &&
                <>
                    <div style={{display:'flex',width:'5vw',alignItems:'center',height:'100%',borderRight:'1px solid gray'}}>
                    <div style={{objectFit:'contain',padding:'5px',marginRight:'5px',alignSelf:'center'}}><img src={teamInfo.primaryLogo} style={{width:'3vh',height:'3vh'}}></img></div>
                    <p style={{paddingRight:'5px',marginRight:'5px'}}>{teamInfo.abbr}</p>
                    </div>
                    <div style={{display:'flex',width:'3vw',alignItems:'center',height:'100%',borderRight:'1px solid gray',justifyContent:'center'}}><p>{teamRecord.W}</p></div>
                    <div style={{display:'flex',width:'3vw',alignItems:'center',height:'100%',borderRight:'1px solid gray',justifyContent:'center'}}><p>{teamRecord.L}</p></div>
                    <div style={{display:'flex',width:'3vw',alignItems:'center',height:'100%',borderRight:'1px solid gray',justifyContent:'center'}}><p>{winPerc}</p></div>
                </>
            }
        </div>
    )
}