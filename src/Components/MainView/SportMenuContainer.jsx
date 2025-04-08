import './SportMenuContainer.css'

export default function SportMenuContainer({sportAbbr,sportName,sportImage,navFunc}){
    
    return(
        <div className="sport-menu" onClick={navFunc}>
            <div className="sport-menu-img"><img className="logo-img" src={sportImage} alt={sportName}></img></div>
            <div className="menu-title">
                <p style={{alignSelf:'flex-start'}}>{sportAbbr}</p>
                <p style={{alignSelf:'flex-start',fontSize:'30px'}}>{sportName}</p>
            </div>
        </div>
    )
}