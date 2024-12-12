import { useState,useEffect } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { useNavigate,Route,Routes } from 'react-router-dom'
import { auth } from '../../firebase'
import './Home.css'

import MainMenu from './MainMenu'
import MLBView from './MLBView'

export default function Home(){
    const [isAuthenticated,setIsAuthenticated] = useState(false)
    const navigate = useNavigate()
    useEffect(() => {
        onAuthStateChanged(auth,(user) => {
            if(user){
                setIsAuthenticated(true);
                console.log(user.uid);
            }
            else{
                navigate("/")
                console.log("No user signed in")
            }
        })
    },[])
    
    return(
        <>
        {isAuthenticated &&
        <Routes>
            <Route path={"/"} element={<MainMenu/>}/>
            <Route path={"/mlb"} element={<MLBView/>}/>
        </Routes>
        }
        </>
    )
} 