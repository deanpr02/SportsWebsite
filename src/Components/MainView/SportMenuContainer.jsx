import './SportMenuContainer.css'

export default function SportMenuContainer({sportName,sportImage,navFunc}){
    
    return(
        <div className="sport-menu" onClick={navFunc}>
            <div className="menu-title">
                <p>{sportName}</p>
            </div>
            <img className="logo-img" src={sportImage} alt={sportName}></img>
        </div>
    )
}