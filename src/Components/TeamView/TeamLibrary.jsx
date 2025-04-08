import { useNavigate } from "react-router-dom"
import { useRetrieveTeam } from "../../Hooks/useRetrieveTeam"
import './TeamLibrary.css'

export default function TeamLibrary({teams,setTeam}){
    return(
        <div className="team-library">
            {teams.map((team,index) =>{
                return <TeamWidget key={index} teamName={team} setTeam={setTeam}/>
            })}
        </div>
    )
}

function TeamWidget({teamName,setTeam}){
    const navigate = useNavigate()
    const teamObject = useRetrieveTeam(teamName)

    const handleClick = () => {
        setTeam(teamObject)
        navigate('./team')
    }

    return(
        <div className="team-widget" onClick={handleClick} style={{backgroundColor:`#${teamObject.secondaryColor}a0`}}>
            <img className="widget-img" src={teamObject.primaryLogo} alt="widget img"/>
            <div className="text-widget" style={{backgroundColor:`#${teamObject.primaryColor}`}}>
                <p>{teamObject.city}</p>
                <div className="name-widget-text">
                    <p className="city-hidden">{teamObject.city.substring(0,teamObject.city.length-2)}</p>
                    <p>{teamObject.name}</p>
                </div>
            </div>
        </div>
    )
}