import { useState,useEffect,createContext } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { useNavigate,Route,Routes } from 'react-router-dom'
import { auth } from '../../firebase'
import './Home.css'

import MainMenu from './MainMenu'
import MLBView from './MLBView'

export const UserContext = createContext(null);

export default function Home(){
    const [isAuthenticated,setIsAuthenticated] = useState(false);
    const [userID,setUserID] = useState(null);
    const navigate = useNavigate()
    useEffect(() => {
        onAuthStateChanged(auth,(user) => {
            if(user){
                setIsAuthenticated(true);
                setUserID(user.uid);
            }
            else{
                navigate("/");
                console.log("No user signed in");
            }
        })
    },[])
    
    return(
        <>
        {isAuthenticated &&
        <UserContext.Provider value={{userID}}>
            <Routes>
                <Route path={"/"} element={<MainMenu/>}/>
                <Route path={"/mlb/*"} element={<MLBView/>}/>
            </Routes>
        </UserContext.Provider>
        }
        </>
    )
} 