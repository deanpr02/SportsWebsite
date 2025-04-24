import { useState,useContext,useEffect } from 'react'
import { PlayerContext } from './TeamPage';
import { useParams } from 'react-router-dom'
import { LineChart,PieChart, ResponsiveChartContainer } from '@mui/x-charts';
import './PlayerPage.css'
import WAR from '../../assets/mlb-resources/mlb-war.png'
import AB from '../../assets/mlb-resources/mlb-ab.png'
import BB from '../../assets/mlb-resources/mlb-bb.png'
import CS from '../../assets/mlb-resources/mlb-cs.png'
import Doubles from '../../assets/mlb-resources/mlb-doubles.png'
import Triples from '../../assets/mlb-resources/mlb-triples.png'
import Games from '../../assets/mlb-resources/mlb-games.png'
import GIDP from '../../assets/mlb-resources/mlb-gidp.png'
import H from '../../assets/mlb-resources/mlb-h.png'
import HBP from '../../assets/mlb-resources/mlb-hbp.png'
import IBB from '../../assets/mlb-resources/mlb-ibb.png'
import R from '../../assets/mlb-resources/mlb-r.png'
import RBI from '../../assets/mlb-resources/mlb-rbi.png'
import SF from '../../assets/mlb-resources/mlb-sf.png'
import HR from '../../assets/mlb-resources/mlb-hr.png'
import SO from '../../assets/mlb-resources/mlb-so.png'
import Down from '../../assets/mlb-resources/mlb-down.png'
import DownArrow from '../../assets/down-arrow.png'
import Blank from '../../assets/mlb-resources/blank_face.png'
import { useFetchPlayerStats } from '../../Hooks/useFetchPlayerStats'
import { useGetAverageStat } from '../../Hooks/useGetAverageStat';
import { useDatabase } from '../../Hooks/useDatabase'
import { usePlayerNames } from '../../Hooks/usePlayerNames';
import { useFetchComparedPlayer } from '../../Hooks/useFetchComparedPlayer';
import Spinner from '../MainView/Spinner';


const playerStats = {'stats': {
                            '2024': {
                                    'b_war': 10.8,
                                    'b_ab': 559,
                                    'b_batting_avg': .322,
                                    'b_bb': 133,
                                    'b_cs': 0,
                                    'b_doubles': 36,
                                    'b_games': 158,
                                    'b_gidp': 22,
                                    'b_h': 180,
                                    'b_hbp': 9,
                                    'b_hr': 58,
                                    'b_ibb': 20,
                                    'b_onbase_perc': .458,
                                    'b_onbase_plus_slugging': 1.159,
                                    'b_onbase_plus_slugging_plus':223,
                                    'b_pa': 704,
                                    'b_r': 122,
                                    'b_rbat_plus': 223,
                                    'b_rbi': 144,
                                    'b_roba': .484,
                                    'b_sb': 10,
                                    'b_sf': 2,
                                    'b_sh': 0,
                                    'b_slugging_perc': .701,
                                    'b_so': 171,
                                    'b_tb': 392,
                                    'b_triples': 1,
                                    'b_war': 10.8
                            }
}
}

const statDetails = {
    'gamesPlayed': Games,
    'groundOuts': GIDP,
    'airOuts': SF,
    'runs': R,
    'doubles': Doubles,
    'triples': Triples,
    'homeRuns': HR,
    'strikeOuts': SO,
    'baseOnBalls': BB,
    'intentionalWalks': IBB,
    'hits': H,
    'hitByPitch': HBP,
    'avg': H,
    'atBats': AB,
    'obp': H,
    'slg': H,
    'ops': RBI,
    'caughtStealing': CS,
    'stolenBases': R,
    'stolenBasePercentage': R,
    'groundIntoDoublePlay': GIDP,
    'numberOfPitches': BB,
    'plateAppearances': AB,
    'totalBases': AB,
    'rbi': RBI,
    'leftOnBase': CS,
    'sacBunts': R,
    'sacFlies': R,
    'babip': H,
    'groundOutsToAirOuts':SF,
    'catchersInterference': IBB,
    'atBatsPerHomeRun': AB
}

export default function PlayerPage({teamInfo}){
    const {playerName} = useParams()
    const {playerID,_} = useContext(PlayerContext)
    const {dataObj,isLoading} = useDatabase('/api/player_info',{'id':playerID})
    const { playerData, isBaseLoading, baseError } = useFetchPlayerStats("http://localhost:5000/api/webscrape/individual_player",'mlb',playerName)
    const [year, setYear] = useState('2025')

    return(
        <>
        {isLoading ? <Spinner color={teamInfo.primaryColor}/>
        :
        <div className='player-page-container'>
            {playerData && dataObj && 
            <>
                <PlayerAbout about={dataObj.about} number={dataObj['number']} image={dataObj['image-link']} position={dataObj.position} teamInfo={teamInfo} seasons={Object.keys(dataObj.stats)}/>
                <PlayerStats stats={dataObj.stats} year={year} setYear={setYear} playerData={dataObj.stats}/>
                <PlayerChart stats={dataObj.stats} teamInfo={teamInfo}/>
                <PlayerAwards awards={dataObj.awards}/>
                <PlayerComparison currentPlayerStats={dataObj.stats} currentPlayerImage={dataObj['image-link']} currentPlayerName={playerName}/>
            </>
            }
        </div>
        }
        </>
    )
}

function PlayerAbout({about,number,image,position,teamInfo,seasons}){
    const {playerName} = useParams()
    return(
        <div className='profile-container'>
            <PlayerProfile teamInfo={teamInfo} image={image}/>
            <p className='profile-name'>{playerName}</p>
            <PlayerNumber primaryColor={teamInfo.primaryColor} secondaryColor={teamInfo.secondaryColor} number={number}/>
            <div className='position-sec'>
                <p>Bats: {about['batside']}</p>
                <div className='diagonal-line-1'></div>
                <p>Throws: {about['pitchhand']}</p>
            </div>
            <div className='position-sec'>
                <p>Measurements:</p>
                <p>{about['height']} - {about['weight']} lbs</p>
            </div>
            <div className='position-sec'>
                <img className='profile-team-image' src={teamInfo.secondaryLogo}></img>
                <p>{teamInfo.city} {teamInfo.name}</p>
                <div className='diagonal-line-1'></div>
                <p>{position}</p>
            </div>
            <div className='position-sec'>
                <p>Born:</p>
                <p>{about['birthdate']}</p>
            </div>
            <div className='position-sec'>
                <p>Birthplace:</p>
                <p>{about.birthplace}</p>
            </div>
            <div className='position-sec' style={{borderBottom:'2px solid gray'}}>
                <p>Seasons:</p>
                <p>{seasons.length}</p>
            </div>
        </div>
    )
}

function PlayerNumber({primaryColor,secondaryColor,number}){
    return(
        <div className='player-number' style={{border:`5px solid color-mix(in srgb, #${primaryColor} 90%, white)`,backgroundColor:`#${secondaryColor}`}}>
            <p className='number' style={{WebkitTextStroke:`1px #${primaryColor}`,color:`#${secondaryColor}`}}>{number}</p>
        </div>
    )
}

function PlayerProfile({teamInfo,image}){
    return(
        <>
        <div className='player-profile' style={{backgroundImage:`url(${teamInfo.primaryLogo})`,backgroundColor:`#${teamInfo.secondaryColor}`}}>
            <PlayerImage teamInfo={teamInfo} image={image}/>
            <div className='player-image-frame'>
                <p></p>
            </div>
        </div>
        </>
    )
}


function PlayerImage({teamInfo,image}){
    return(
        <div className='player-page-image-container'>
            <img className='player-page-image' src={image} alt={'player-image'}></img>
        </div>
    )
}

function StatDropDown({data,state,setFunc}){
    const DropMenu = () => {
        return(
            <div className='stat-dropdown-menu'>
                {data.map((obj => {
                    return <p className='stat-dropdown-item' 
                                onClick={()=>{
                                    setFunc(obj)
                                    setDropped(false)
                                }}
                            >{obj}</p>
                }))}
            </div>
        )
    }

    const [dropped,setDropped] = useState(false)

    return(
        <div className='stat-dropdown-container'>
            <div className='stat-dropdown' onClick={()=>setDropped((prev) => !prev)}>
                {!dropped ? 
                    <p className='stat-dropdown-text'>{state}</p>
                    :
                    <p className='stat-dropdown-text' style={{opacity:0}}>{state}</p>   
                }
                <img src={DownArrow}/>
            </div>
            {dropped && <DropMenu setFunc={setFunc}/>}
        </div>

    )
}

function PlayerStats({stats,year,setYear,playerData}){
    const batchSize = 21;
    const shownBatch = Object.entries(stats[year]).slice(0,batchSize)
    const [hidden,setHidden] = useState(true)
    //const {averageStats} = useGetAverageStat('mlb','2024',Object.keys(playerData[year]))
    //const greenRatio = Math.round(Math.min((stats[year]['b_hr'] / averageStats)*200,255))
    //const redRatio = Math.round(Math.min(averageStats/stats[year]['b_hr'])*200,255)


    return(
        <div className='player-stats-container'>
            <div className='stat-bar'>
                <p className='stats-text-header'>Stats</p>
                <StatDropDown data={Object.keys(stats).reverse()} state={year} setFunc={setYear}/>
            </div>
            {hidden ? 
                        shownBatch.map(([key,value]) => {
                            return <StatRow statistic={value} title={key} logo={statDetails[key]}/>
                        })
                        :
                        Object.entries(stats[year]).map(([key,value]) => {
                            return <StatRow statistic={value} title={key} logo={statDetails[key]}/>
                        })}
            <div className='expand-bar' style={{padding:'1px'}} onClick={() => setHidden((prev) => !prev)}>
                {hidden ?
                    <img className='expand-bar-img' src={Down} style={{width:'50px'}}/>
                    :
                    <img className='expand-bar-img' src={Doubles}/>
                }
            </div>
        </div>
    )
}

function StatRow({statistic,title,logo}){
    return(
        <div className='stat-row'>
            <img className='stat-row-image' src={logo}/>
            <p>{title}</p>
            <p className='stat-row-stat'>{statistic}</p>
            <div className='stat-row-color'></div>
        </div>
    )

}

function PlayerChart({stats,teamInfo}){
    const [statName,setStatName] = useState('avg')
    const years = Object.keys(stats)
    const statNameList = Object.keys(stats['2024'])
    const statValues = Object.values(stats).map((statObj => statObj[statName])) 
    return(
        <div className='player-chart-container'>
            <p className='text-header'>Visualization</p>
            <div style={{width:'15vh',margin:'5px'}}>
            <StatDropDown data={statNameList} state={statName} setFunc={setStatName}/>
            </div>
            <div className='charts'>
            <StatLineChart xValues={years} yValues={statValues} statName={statName} teamColor={teamInfo.primaryColor}/>
            <StatPieChart xValues={years} yValues={statValues} statName={statName} primaryColor={teamInfo.primaryColor} secondaryColor={teamInfo.secondaryColor}/>
            </div>
        </div>
    )
}

function StatPieChart({xValues,yValues,statName,primaryColor,secondaryColor}){
    const data = xValues.map((label, index) => ({
        id: index,
        value: Number(yValues[index]),
        label: label
    }));

    const add = (a,b) => Number(a)+Number(b);
    const total = yValues.reduce(add)

    return (
        <div style={{width:'60vh',height:'60vh'}}>
        <p style={{fontSize:'26px',alignItems:'left',lineHeight:0}}>{`Career ${statName}: ${total}`}</p>
        <PieChart
            colors={[`#${primaryColor}`,`color-mix(in srgb, #${primaryColor} 40%, #${secondaryColor})`,`color-mix(in srgb, #${primaryColor} 70%, #${secondaryColor})`]}
            series={[
                {
                    data: data,
                    arcLabel: (item) => `'${item.label.slice(-2)}`
                },
            ]}
            
            margin={{ top: 50, bottom: 50, left: 50, right:100 }}
            slotProps={{
                legend: {
                    direction: 'column',
                    position: { vertical: 'middle', horizontal: 'right' },
                    itemMarkWidth: 20,
                    itemMarkHeight: 20,
                    markGap: 5,
                    itemGap: 10,
                    labelStyle: {
                        fontSize: 14,
                        fill: `white`,
                    },
                },
            }}
            sx={{
                '.MuiPieArcLabel-root': {
            fill: `#${secondaryColor}`,
            fontSize: 14,
            fontWeight: 'bold',
        },
        ".MuiChartsAxis-tickLabel": {
            fill: "white",
        },
        '.MuiChartsLegend-label': {
            fill: 'white',
        },
        '.MuiChartsLegend-series text': {
            fill: 'white',
        },
            }}
        />
        </div>
    );
}


function StatLineChart({xValues,yValues,statName,teamColor}){
    return(
        <div style={{width:'60vh',height:'50vh'}}>
        <LineChart 
        xAxis={[{
            data:xValues,
            valueFormatter: (value) => `${String(value)}`,
            tickLabelInterval: () => true
        }]}
        yAxis={[{
            tickLabelInterval: () => true
        }]}
        series={[{
            data:yValues,
            color: `#${teamColor}`
        }]}
        grid={{ vertical: true, horizontal: true }}
        sx={{
            ".MuiChartsAxis-root .MuiChartsAxis-line": {
                stroke: "gray", // Changes axis line color
            },
            ".MuiChartsAxis-tickLabel": {
                fill: "white !important", // Changes axis text color
            },
            '.MuiChartsGrid-line': {
                stroke: 'gray'  // Change grid line color
            },
            '.MuiChartsAxis-label': {
                    fill: 'white !important',
                },
        }}
        />
        </div>
    )
}

function PlayerAwards({awards}){
    const awardYears = awards.map((award => <p style={{height:'5vh'}}>{award.year}</p>))
    const awardTitles = awards.map((award => <p style={{height:'5vh'}}>{award.name}</p>))
    return(
        <div className='player-awards-container'>
            <div className='stat-bar'>
                <p className='stats-text-header'>Awards</p>
            </div>
            <div className='award-columns'>
                <p style={{fontSize:'30px',width:'20%',borderRight:'2px solid gray',borderBottom:'2px solid gray'}}>Year</p>
                <p style={{fontSize:'30px',width:'80%',borderBottom:'2px solid gray'}}>Award</p>
            </div>
            <div style={{display:'flex',flexDirection:'row'}}>
                <div style={{width:'20%',fontSize:'1.5vw',borderRight:'2px solid gray'}}>
                    {awardYears}
                </div>
                <div style={{width:'80%',fontSize:'1.5vw'}}>
                    {awardTitles}
                </div>
            </div>
        </div>
    )
}

function PlayerComparison({currentPlayerStats,currentPlayerImage,currentPlayerName}){
    const [otherName,setOtherName] = useState('---')
    const [otherImage,setOtherImage] = useState(Blank)
    const [yearsAvailable,setYearsAvailable] = useState(Object.keys(currentPlayerStats).reverse())
    const { playerNameList } = usePlayerNames()
    const [year,setYear] = useState('2025')
    return(
        <div className='player-comparison-container'>
            <div className='stat-bar' style={{width:'100%'}}>
                <p className='stats-text-header' style={{width:'100%'}}>Player Comparison</p>
                <StatDropDown data={yearsAvailable} state={year} setFunc={setYear}/>
            </div>
            {playerNameList &&
                <div>
                    <div className='player-comparison'>
                        <CurrentPlayer stats={currentPlayerStats} image={currentPlayerImage} name={currentPlayerName}/>
                        <CompPlayer names={playerNameList} otherName={otherName} setOtherName={setOtherName} image={otherImage}/>
                    </div>
                    <StatCompare playerOne={currentPlayerStats} playerTwo={otherName === '---' ? null : playerNameList[otherName]} year={year} setImage={setOtherImage} setYears={setYearsAvailable}/>
                </div>
                }
        </div>
    )

}

function CurrentPlayer({stats,image,name}){
    return(
        <div className='player-comp-card'>
            <img className='player-comp-img' src={image}/>
            <p style={{fontSize:'32px'}}>{name}</p>
        </div>
    )
}

function CompPlayer({names,otherName,setOtherName,image}){
    return(
    <div className='player-comp-card'>
        <img className='player-comp-img' src={image}/>
        <StatDropDown data={Object.keys(names)} state={otherName} setFunc={setOtherName}/>
    </div>
    )
}

function StatCompare({playerOne,playerTwo,year,setImage,setYears}){
    const { playerData,isLoaded } = useFetchComparedPlayer(playerTwo)

    useEffect(() => {
        if(playerData){
            setImage(playerData['image'])
            const currentPlayerYears = Object.keys(playerOne)
            const otherPlayerYears = Object.keys(playerData['stats'])
            const years = currentPlayerYears.length <= otherPlayerYears.years ? currentPlayerYears : otherPlayerYears
            setYears(years.reverse())
        }
    },[playerData])

    return(
        <>
        {!playerTwo || isLoaded ?
        <div style={{display:'flex',flexDirection:'column',alignItems:'center',width:'80vh'}}>
        {Object.keys(playerOne[year]).map((key) => {
            const comparedPlayerStat = playerData ? playerData['stats'][year][key] : 0
            return (<div className='stat-compare-row'>
                        {Number(playerOne[year][key]) > comparedPlayerStat 
                        ? 
                        <>
                            <p className='current-player-compare' style={{color:'green'}}>{playerOne[year][key]} </p>
                            <div style={{display:'flex',flexDirection:'row'}}><p style={{color:'gray',textWeight:'bold',paddingRight:'10px'}}>{'<'}</p><p style={{fontSize:'24px'}}>{key} </p></div>
                            <p style={{width:'20vh',color:'red'}}>{comparedPlayerStat}</p>
                        </>
                        :
                        comparedPlayerStat > playerOne[year][key] 
                        ?
                        <>
                            <p className='current-player-compare' style={{color:'red'}}>{playerOne[year][key]} </p>
                            <div style={{display:'flex',flexDirection:'row'}}><p style={{fontSize:'24px'}}>{key} </p><p style={{color:'gray',textWeight:'bold',paddingLeft:'10px'}}>{'>'}</p></div>
                            <p style={{width:'20vh',color:'green'}}>{comparedPlayerStat}</p>
                        </>
                        :
                        <>
                            <p className='current-player-compare' style={{color:'white'}}>{playerOne[year][key]} </p>
                            <p style={{fontSize:'24px'}}>{key} </p>
                            <p style={{width:'20vh',color:'white'}}>{comparedPlayerStat}</p>
                        </>
                    }
                    </div>
                    )
        })}
        </div>
        :
        <Spinner color={'000000'}/>
        }
        </>
    )
}