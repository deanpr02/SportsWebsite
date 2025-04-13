import { TbRelationManyToManyFilled } from 'react-icons/tb'
import './StandingsChart.css'
import { useRetrieveTeam } from '../../Hooks/useRetrieveTeam'

export default function StandingsChart({standings}){
    return(
        <div className='standings-chart-container'>
            <div className='standings-conference'>
                {Object.entries(standings['American League']).map(([name,teams]) => {
                    return <StandingsDivision divisionName={name} divisionTeams={teams}/>
                })}
            </div>
            <div className='standings-conference'>
            {Object.entries(standings['National League']).map(([name,teams]) => {
                    return <StandingsDivision divisionName={name} divisionTeams={teams}/>
                })}
            </div>      
        </div>
    )
}

function StandingsDivision({divisionName,divisionTeams}){
    return(
        <div className='standings-division-container'>
            <p style={{fontSize:'18px',width:'100%',borderBottom:'1px solid gray'}}>{divisionName}</p>
            {Object.entries(divisionTeams).map(([teamName,obj]) => {
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