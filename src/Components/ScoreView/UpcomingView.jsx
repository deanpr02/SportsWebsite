import StadiumCloud from './StadiumCloud'
import Spinner from '../MainView/Spinner'

import { useDatabase } from '../../Hooks/useDatabase'

import './UpcomingView.css'

export default function UpcomingView({awayTeamInfo,homeTeamInfo}){
    return(
        <div className='mlb-mid-score'>
            <>
                <SideView city={awayTeamInfo.city} color={awayTeamInfo.primaryColor} teamName={awayTeamInfo.abbr}/>
                <StadiumCloud homeName={homeTeamInfo.abbr}/>
                <SideView city={homeTeamInfo.city} color={homeTeamInfo.primaryColor} teamName={homeTeamInfo.abbr}/>
            </>
        </div>
    )
}

function SideView({city,color,teamName}){
    const {dataObj,isLoading} = useDatabase('/api/team_rank',{'name':teamName})
    return(
        <div className='mlb-side-view'>
            <p>{city}</p>
            <>
            {!isLoading ? 
                dataObj.map((obj) => {
                    return <TeamStatBar statName={obj.name} statRank={obj.rank} stat={obj.value} color={color}/>
                })
                :
                <Spinner color={color} height={'100%'}/>
            }
            </>
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