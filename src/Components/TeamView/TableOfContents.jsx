import './TableOfContents.css'
import { useState,useContext } from 'react'
import { WidgetContext } from './TeamPage'

//About - championships, description, stadium
//Depth Chart - player cards, selection like the champions on automai, have different sorting techs
//can click on a player to see their stats
//History - results of previous seasons, record, position in division, postseason results, awards
//Team stats in comparison to rest of league, etc.

export default function TableOfContents({color}){
    return(
        <div className="toc-container">
            <p className="toc-header">Table of Contents</p>
            <div className="toc-items">
                    <TOCItem tocName={"About"} teamColor={color} clickKey={0}/>
                    <TOCItem tocName={"Depth Chart"} teamColor={color} clickKey={1}/>
                    <TOCItem tocName={"History"} teamColor={color} clickKey={2}/>
                    <TOCItem tocName={"Team Statistics"} teamColor={color} clickKey={3}/>
            </div>
        </div>
    )
}

function TOCItem({tocName,teamColor,clickKey}){
    const handleClick = () => {
        setWidgetKey(clickKey)
        setIsHovered(false)
    }
    
    const [isHovered,setIsHovered] = useState(false)
    const {widgetKey,setWidgetKey} = useContext(WidgetContext);

    return(
        <div onClick={handleClick}>
            {widgetKey == clickKey ? 
            <ul>
                <li className="toc-text" style={{color:`color-mix(in srgb, #${teamColor} 80%, white)`}}>{tocName}</li>
            </ul>
            :
            <p className="toc-text" style={{color: isHovered ? `color-mix(in srgb, #${teamColor} 80%, white)` : 'white'}}
            onMouseEnter={()=>setIsHovered(true)}
            onMouseLeave={()=>setIsHovered(false)}
            >{tocName}</p>}
        </div>

    )
}