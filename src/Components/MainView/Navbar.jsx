import './Navbar.css'
import LogOut from '../../assets/menu-resources/logout.png'
import { useNavigate } from 'react-router-dom'
import { signOut } from 'firebase/auth'
import { auth } from '../../firebase'

export default function Navbar({leagueLogo,homePath}){
    const navigate = useNavigate()

    const logout = async () => {
        try{
            await signOut(auth);
            console.log('User Logged Out');
        }
        catch(error){
            console.error('Logout error:',error.message);
        }
    }
    
    return(
        <div className="navbar-container">
            <div className="selected-league" onClick={()=>navigate('/home')}>
                <img className="league-logo" src={leagueLogo} alt="league-logo"></img>
                <p>MLB</p>
            </div>
            <div className="nav-items">
                <NavbarItem itemName={"Scores"} itemID={''} homePath={homePath}/>
                <NavbarItem itemName={"Standings"} itemID={'standings'} homePath={homePath}/>
                <NavbarItem itemName={"Statistics"} itemID={'stats'} homePath={homePath}/>
                <NavbarItem itemName={"Bracket"} itemID={'bracket'} homePath={homePath}/>
                <NavbarItem itemName={"Team"} itemID={'teams'} homePath={homePath}/>
                <NavbarItem itemName={"Clubhouses"} itemID={'clubhouse'} homePath={homePath}/>
            </div>
            <img className='nav-logout-button' src={LogOut} onClick={logout}></img>
        </div>
    )
}

function NavbarItem({itemName,itemID,homePath}){
    const navigate = useNavigate();
    return(
        <div className="item" onClick={()=>navigate(`${homePath}/${itemID}`)}>
            <p style={{paddingRight:'20px'}}>{itemName}</p>
            <div className="diagonal-line" style={{borderBottom:`2px solid gray`}}></div>
        </div>
    )
}