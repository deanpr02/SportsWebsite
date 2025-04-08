import TableOfContents from './TableOfContents'

import './TeamNav.css'

import AL from '../../assets/mlb-resources/american-league.png'
import NL from '../../assets/mlb-resources/national-league.png'

export default function TeamNav({division,location,color}){
    return(
        <>
        <div className="team-nav-container">
            {division.includes('AL')? 
            <img className='division-img' src={AL} alt='division'></img>
            :
            <img className='division-img' src={NL} alt='division'></img>}
            <p className="division-name">{division}</p>
            <p className="stadium-location">{location}</p>
        </div>
        <TableOfContents color={color}/>
        </>
    )
}