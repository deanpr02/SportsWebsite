import Map from './Map'
import { Spinner } from "flowbite-react";
import { useFetchData } from '../../Hooks/useFetchData'

import Trophy from '../../assets/mlb-resources/ws-trophy.png'
import './About.css'

export default function About({teamName,teamDescription,teamStadium,teamLat,teamLon,teamAbbr}){
    const {data,isLoading,error} = useFetchData("http://localhost:5000/api/webscrape/team",{"name":teamAbbr},`${teamName}-about`);
    
    return(
        <div className="about-container">
            <p className="about-text">About the {teamName}</p>
            <div className="description-area">
                <p>{teamDescription}</p>
            </div>
            <div className="map-area">
                <p className="about-text">Stadium</p>
                <div className="about-images">
                    <Map lat={teamLat} lon={teamLon}/>
                    <img src={teamStadium} alt="team-stadium"></img>
                </div>
            </div>
            <p className="about-text">Championships</p>
            <div className="championship-container">
                {isLoading ? 
                    <Spinner color="info"/>
                    :
                    <>
                    <p>Total Championships: {data["championships"].length}</p>
                    {data["championships"].length > 0 ? 
                    <AboutChart years={data["championships"]}/>
                    :
                    <p className="null-text">No Championships {":("}</p>
                    }
                    </>
                }
            </div>
        </div>
    )
}

function AboutChart({years}){
    return(
        //check if index is even if it is then the background color will be black else gray
        <>
            {years && years.map(((year,index) =>{
                return index % 2 == 0 ?
                            <div key={index} className="chart-row" style={{backgroundColor:'rgba(0,0,0,0.3)'}}>
                                <div className="column-trophy">
                                    <img className="chart-img" src={Trophy} alt='trophy'/>
                                </div>
                                <div className="column">
                                    <p className='chart-year'>{year}</p>
                                </div>
                            </div>
                            :
                            <div key={index} className="chart-row" style={{backgroundColor:'rgba(100,100,100,0.3)'}}>
                                <div className="column-trophy">
                                    <img className="chart-img" src={Trophy} alt='trophy'/>
                                </div>
                                <div className="column">
                                    <p className='chart-year'>{year}</p>
                                </div>
                            </div>
            }))}
        </>
    )
}