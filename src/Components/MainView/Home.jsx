import { useState,useEffect,createContext } from 'react';
import { useNavigate,Route,Routes } from 'react-router-dom'

import './Home.css'

import MainMenu from './MainMenu'
import MLBView from './MLBView'

export const UserContext = createContext(null);

export default function Home(){
    const [isAuthenticated,setIsAuthenticated] = useState(false);
    const [userID,setUserID] = useState(null);
    const navigate = useNavigate()

    useEffect(() => {
        fetch('/api/validate', { credentials: 'include' })
            .then(res => {
                if (res.ok) return res.json();
                throw new Error('Not authenticated');
            })
            .then(data => {
                setIsAuthenticated(true);
                setUserID(data.user_id);
                console.log(data.user_id)
            })
            .catch(() => {
                navigate('/');
                console.log('No user signed in');
            });
    }, []);
    
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