import { useContext,useState} from 'react'
import { WidgetContext } from './TeamPage'
import About from './About'
import DepthChart from './DepthChart'
import History from './History'
import TeamStats from './TeamStats'
import Test from './PlayerPage'

export default function TeamWidget({teamInfo}){
    const {widgetKey} = useContext(WidgetContext)
    const [playerName,setPlayerName] = useState('Judge')
    const PageWidgets = {
            0: <About teamName={teamInfo.name} teamDescription={teamInfo.description} teamStadium={teamInfo.stadium} teamLat={teamInfo.coords[0]} teamLon={teamInfo.coords[1]} teamAbbr={teamInfo.abbr}/>,
            1: <DepthChart teamName={teamInfo.abbr} primaryColor={teamInfo.primaryColor} secondaryColor={teamInfo.secondaryColor}/>,
            2: <History/>,
            3: <TeamStats/>
        }
    
    return(
        <>
            {PageWidgets[widgetKey]}
        </>
    )
}