import { useRetrieveTeam } from '../../Hooks/useRetrieveTeam'
import './MLBGame.css'
import StadiumCloud from "./StadiumCloud"

export default function MLBGame({home,away}){
    const homeTeamInfo = useRetrieveTeam(home);
    const awayTeamInfo = useRetrieveTeam(away);

    return(
        <div className='mlb-game-container'>
            <ScoreBox homeInfo={homeTeamInfo} awayInfo={awayTeamInfo}/>
            <div className='mlb-mid-score'>
                <SideView/>
                <StadiumCloud/>
                <SideView/>
            </div>
        </div>
    )
}

function ScoreBox({homeInfo,awayInfo}){
    return(
        <div className='mlb-score-box'>
            <ScoreBug homeAbbr={homeInfo.abbr} awayAbbr={awayInfo.abbr} homeLogo={homeInfo.primaryLogo} awayLogo={awayInfo.primaryLogo}/>
        </div>
    )
}

function ScoreBug({homeAbbr,awayAbbr,homeLogo,awayLogo}){
    return(
        <div className='mlb-score-bug'>
            <div className='score-bug-section'>
                <img className='score-bug-logo' src={awayLogo}></img>
                <p>{awayAbbr}</p>
            </div>
            <div className='score-bug-section'>
                <img className='score-bug-logo' src={homeLogo}></img>
                <p>{homeAbbr}</p>
            </div>
        </div>
    )
}

function SideView(){
    return(
        <div className='mlb-side-view'>
            <p>Side</p>
        </div>
    )
}