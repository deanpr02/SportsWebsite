import { useState,useEffect,useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import FilterImage from '../../assets/mlb-resources/filter.png'
import SortImage from '../../assets/mlb-resources/sort.png'
import { useDatabase } from '../../Hooks/useDatabase'
import { PlayerContext } from './TeamPage'

import './DepthChart.css'

const defaultPicture = "https://img.mlbstatic.com/mlb-photos/image/upload/d_people:generic:headshot:silo:current.png/r_max/w_180,q_auto:best/v1/people/683679/headshot/silo/current"

export default function DepthChart({teamName,primaryColor,secondaryColor}){
    const [sortKey,setSortKey] = useState(null)
    const {dataObj} = useDatabase('/api/depth_chart',{'name':teamName})
    const [sortDirection,setSortDirection] = useState(1)
    const [sortedAttribute,setSortedAttribute] = useState("N/A")
    
    return(
        <div className='depth-additional'>
        <p className="header-text">Depth Chart</p>
        <FilterSortBar setSortKey={setSortKey} setSortDirection={setSortDirection} setSortedAttribute={setSortedAttribute}/>
        <div className='depth-chart-container'>
            {dataObj && <PlayerPool playerList={dataObj} primaryColor={primaryColor} secondaryColor={secondaryColor} sortKey={sortKey} sortDirection={sortDirection} sortedAttribute={sortedAttribute}/>}
        </div>
        </div>
    )
}

function PlayerPool({playerList,primaryColor,secondaryColor,sortKey,sortDirection,sortedAttribute}){
    const [modifiedData,setModifiedData] = useState(playerList)

    const filterPlayers = (playerObject,key) => {
        return Object.fromEntries(
            Object.entries(playerObject).filter(([_,value]) =>{
                return typeof value.stats['2025'] === 'object' && value.stats['2025'] !== null && key in value.stats['2025']
            })
        )
    }

    const sortPlayers = (array, key, direction) => {
        return Object.fromEntries(Object.entries(array).sort((a, b) => {
            let aValue = undefined;
            let bValue = undefined;
        if(key === "name"){
            aValue = Object.keys(a)[0];
            bValue = Object.keys(b)[0];
            return direction * aValue.localeCompare(bValue);
        }
        else{
            aValue = Object.values(a)[1]['stats']['2025'][key];
            bValue = Object.values(b)[1]['stats']['2025'][key];
            return direction * (Number(bValue) - Number(aValue))
        }
        }));
    };

    useEffect(() => {
        if (sortKey === null) {
            setModifiedData(playerList);
            return;
        }
        
        let filteredData = playerList;
        if (sortKey !== 'name') {
            filteredData = filterPlayers({...playerList}, sortKey);
        }
        const sortedPlayers = sortPlayers(filteredData, sortKey, sortDirection)
        setModifiedData(sortedPlayers);
    }, [sortKey, sortDirection,playerList]);
    
    return(
        <>
        {modifiedData.map((playerInfo) => (
            <>
            <PlayerCard key={playerInfo.id} playerID={playerInfo.id} playerName={playerInfo.name} playerStats={playerInfo.stats["2025"]} playerPosition={playerInfo.position} playerImage={playerInfo['image-link']} primaryColor={primaryColor} secondaryColor={secondaryColor} sortedAttribute={sortedAttribute}/>
            </>
        ))}
        </>
    )
}

function PlayerCard({playerID,playerName,playerStats,playerPosition,playerImage,primaryColor,secondaryColor,sortedAttribute}){
    const {_,setPlayerID} = useContext(PlayerContext);
    const navigate = useNavigate()

    const navigateToPlayer = () => {
        setPlayerID(playerID);
        navigate(playerName)
    }

    return(
        <div className="player-card" style={{backgroundColor:`#${secondaryColor}`,border:`10px solid #${primaryColor}`}} onClick={navigateToPlayer}>
            <p style={{color:`#${primaryColor}`,borderBottom:`2px solid #${primaryColor}`}}>{playerName}</p>
            <img className="depth-chart-img" src={playerImage ? playerImage : defaultPicture}></img>
            <p style={{color:`#${primaryColor}`,borderTop:`2px solid #${primaryColor}`}}>{playerPosition}</p>
            <p style={{color:`#${primaryColor}`}}>{playerStats[sortedAttribute]}</p>
        </div>
    )
}

function FilterSortBar({setSortKey,setSortDirection,setSortedAttribute}){
    const [tabs,setTabs] = useState([])
    const [isShown,setIsShown] = useState(undefined)
    return(
        <div className='filter-tab-container'>
            {isShown && <div className='tabs'>
                {tabs}
            </div>}
            <FilterTab tabs={tabs} setTabs={setTabs} setIsShown={setIsShown}/>
            <SortTab tabs={tabs} setTabs={setTabs} setIsShown={setIsShown} setSortKey={setSortKey} setSortDirection={setSortDirection} setSortedAttribute={setSortedAttribute}/>
        </div>
    )
}

function FilterTab({tabs,setTabs,setIsShown}){
    const filters = [
    <p className='tab-header'>Filtering:</p>,
    <FilterButton name={"OF"}/>,
    <FilterButton name={"IF"}/>,
    <FilterButton name={"C"}/>,
    <FilterButton name={"SP/RP"}/>,
]
    const openFilter = () => {
        setIsShown((prev)=>prev ? prev==='filter' ? undefined : 'filter' : 'filter')
        setTabs(()=>filters);
    }

    return(
        <div className='filter-tab'>
            <img className='filter-img' src={FilterImage} onClick={openFilter}/>
        </div>
    )
}

function FilterButton({name}){
    return(
        <p className='tab-item'>{name}</p>
    )
}

function SortTab({tabs,setTabs,setIsShown,setSortKey,setSortDirection,setSortedAttribute}){
    const sorts = [
        <p className='tab-header'>Sorting:</p>,
        <SortButton name={"Alphabetical"} identifier={"name"} setSortKey={setSortKey} setSortDirection={setSortDirection} setSortedAttribute={setSortedAttribute}/>,
        <SortButton name={"WAR"} identifier={"b_war"} setSortKey={setSortKey} setSortDirection={setSortDirection} setSortedAttribute={setSortedAttribute}/>,
        <SortButton name={"R"} identifier={"b_r"} setSortKey={setSortKey} setSortDirection={setSortDirection} setSortedAttribute={setSortedAttribute}/>,
        <SortButton name={"H"} identifier={"b_h"} setSortKey={setSortKey} setSortDirection={setSortDirection} setSortedAttribute={setSortedAttribute}/>,
        <SortButton name={"2B"} identifier={"b_doubles"} setSortKey={setSortKey} setSortDirection={setSortDirection} setSortedAttribute={setSortedAttribute}/>,
        <SortButton name={"3B"} identifier={"b_triples"} setSortKey={setSortKey} setSortDirection={setSortDirection} setSortedAttribute={setSortedAttribute}/>,
        <SortButton name={"BA"} identifier={"b_batting_avg"} setSortKey={setSortKey} setSortDirection={setSortDirection} setSortedAttribute={setSortedAttribute}/>,
        <SortButton name={"HR"} identifier={"b_hr"} setSortKey={setSortKey} setSortDirection={setSortDirection} setSortedAttribute={setSortedAttribute}/>
    ]

    const openSort = () => {
        setIsShown((prev)=>prev ? prev==='sort' ? undefined : 'sort' : 'sort')
        setTabs(()=>sorts);
    }
    
    return(
        <div className='filter-tab'>
        <img className='sort-img' src={SortImage} onClick={openSort}/>
        </div>
    )
}

function SortButton({name,identifier,setSortKey,setSortDirection,setSortedAttribute}){
    const [tracker,setTracker] = useState(1)

    const selectSort = () => {
        setSortKey(identifier)
        setSortDirection(tracker)
        setSortedAttribute(identifier)
        setTracker((prev) => prev * -1)
    }

    return(
        <>
        <p className='tab-item' onClick={selectSort}>{name}</p>
        <div className="diagonal-line" style={{borderBottom:`2px solid gray`}}></div> 
        </>
    )
}