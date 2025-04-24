import './TeamPage.css'
import TeamNav from './TeamNav'
import TeamWidget from './TeamWidget'
import PlayerPage from './PlayerPage'
import { useState,useEffect,createContext } from 'react'
import { Routes,Route } from 'react-router-dom'

export const WidgetContext = createContext(null);
export const PlayerContext = createContext(null);

//TODO: Make this nicer with the route, such as moving it to its own component


export default function TeamPage({teamObject}){
    const [widgetKey,setWidgetKey] = useState(0)
    const [teamInfo,setTeamInfo] = useState(null);
    const [aura,setAura] = useState('')
    const [playerID,setPlayerID] = useState(null);

    function hexToRgb(hex){
        const num = parseInt(hex,16);
        const r = (num >> 16) & 255;
        const g = (num >> 8) & 255;
        const b = num & 255;
        return { r, g, b }
    }


    useEffect(()=>{
        //move to custom hook eventually
        let info = teamObject
        if(Object.keys(info).length === 0 ){
            info = JSON.parse(sessionStorage.getItem('team'));
            setTeamInfo(info);
        }
        else{
            sessionStorage.setItem('team',JSON.stringify(teamObject));
            setTeamInfo(teamObject)
        }

        const primaryColor = info.primaryColor
        const rgb = hexToRgb(primaryColor)
        if(rgb.r <= 50){
            rgb.r -= 50
        }
        else{
            rgb.r += 50
        }
        if(rgb.g <= 50){
            rgb.g -= 50
        }
        else{
            rgb.g += 50
        }
        if(rgb.b <= 50){
            rgb.b -= 50
        }
        else{
            rgb.b += 50
        }
        rgb.r = Math.max(Math.min(255,rgb.r),0)
        rgb.g = Math.max(Math.min(255,rgb.g),0)
        rgb.b = Math.max(Math.min(255,rgb.b),0)
        const newrgb = rgb.r.toString(16).padStart(2, '0') + rgb.g.toString(16).padStart(2, '0') + rgb.b.toString(16).padStart(2, '0')
        setAura(newrgb) 
    },[])

    return(
        <PlayerContext.Provider value={{playerID,setPlayerID}}>
        <Routes>
            <Route path={"/"} element={<>
            {teamInfo && 
            <div className="team-page-container">
                <div className="background-image" style={{backgroundImage:`url('${teamInfo.primaryLogo}')`}}></div>
                <div className="team-page-top">
                    <img className="logo" src={teamInfo.secondaryLogo} alt="team-logo" style={{filter:`drop-shadow(0px 0px 30px #${aura})`}}></img>
                    <div className="name" style={{WebkitTextStroke: `1px color-mix(in srgb, #${teamInfo.secondaryColor} 60%, black)`}}>
                        <p className="team-page-city-name" style={{
                            backgroundImage: `linear-gradient(60deg, #${teamInfo.primaryColor},color-mix(in srgb, #${teamInfo.primaryColor} 80%, white))`,
                            backgroundClip: 'text',
                            WebkitBackgroundClip: 'text',
                            backgroundSize: '100%',
                            backgroundRepeat: 'no-repeat',
                            color: 'transparent'
                        }}
                        >{teamInfo.city}</p>
                        <p className="team-page-team-name" style={{
                            backgroundImage: `linear-gradient(30deg, color-mix(in srgb, #${teamInfo.primaryColor} 80%, white),#${teamInfo.primaryColor})`,
                            backgroundClip: 'text',
                            WebkitBackgroundClip: 'text',
                            backgroundSize: '100%',
                            backgroundRepeat: 'no-repeat',
                            color: 'transparent'
                            }}
                        >{teamInfo.name}</p>
                    </div>
                    <WidgetContext.Provider value={{widgetKey,setWidgetKey}}>
                        <TeamNav division={teamInfo.division} location={teamInfo.location} color={teamInfo.primaryColor}/>
                        <TeamWidget teamInfo={teamInfo}/>
                    </WidgetContext.Provider>
                </div>
            </div>
            }
            </>}/>
            <Route path={"/:playerName"} element={<>
            {teamInfo && <PlayerPage teamInfo={teamInfo}/>}</>}/>
        </Routes>
        </PlayerContext.Provider>
    )
}

function TeamPageHeader({teamInfo}){
    return(
        <>
        </>
    )
}